const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const AuditLog = require('../models/AuditLog');
const Config = require('../models/Config');
const ai = require('./aiService');
const search = require('./kbSearchService');

async function log(ticketId, traceId, actor, action, meta) {
  await AuditLog.create({ ticketId, traceId, actor, action, meta });
}

exports.processTicket = async (ticketId) => {
  const traceId = uuidv4();
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    return null;
  }

  await log(ticketId, traceId, 'system', 'AGENT_STARTED');

  try {
    const classification = await ai.classify(`${ticket.title}\n${ticket.description}`);
    await log(ticketId, traceId, 'system', 'AGENT_CLASSIFIED', classification);

    const kbItems = await search.searchTop(
      `${ticket.title}\n${ticket.description}`,
      classification.predictedCategory
    );
    await log(ticketId, traceId, 'system', 'KB_RETRIEVED', {
      kbItemIds: kbItems.map((article) => article._id.toString()),
    });

    const draft = await ai.draft(ticket.description, kbItems);
    await log(ticketId, traceId, 'system', 'DRAFT_GENERATED', {
      citationCount: draft.citations?.length || 0,
    });

    const suggestion = await AgentSuggestion.findOneAndUpdate(
      { ticketId },
      {
        predictedCategory: classification.predictedCategory,
        KBItemIds: kbItems.map((article) => article._id),
        draftReply: draft.draftReply,
        confidence: classification.confidence,
        modelInfo: {
          provider: process.env.STUB_MODE === 'true' ? 'stub' : 'openai',
          promptVersion: 'v1',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const config = (await Config.findOne()) || { autoClose: true, threshold: 0.78 };
    const shouldAutoClose = config.autoClose && classification.confidence >= config.threshold;

    await Ticket.findByIdAndUpdate(ticketId, {
      status: shouldAutoClose ? 'resolved' : 'waiting_human',
      category: classification.predictedCategory,
      agentSuggestionId: suggestion._id,
    });

    await AgentSuggestion.findByIdAndUpdate(suggestion._id, {
      autoClosed: shouldAutoClose,
    });

    await log(
      ticketId,
      traceId,
      'system',
      shouldAutoClose ? 'AUTO_CLOSED' : 'ASSIGNED_TO_HUMAN',
      {
        suggestionId: suggestion._id.toString(),
        confidence: classification.confidence,
      }
    );

    return suggestion;
  } catch (error) {
    await log(ticketId, traceId, 'system', 'AGENT_FAILED', {
      message: error.message,
    });
    throw error;
  }
};
