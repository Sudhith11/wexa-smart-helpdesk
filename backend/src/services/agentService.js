const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const AuditLog = require('../models/AuditLog');
const Config = require('../models/Config');
const ai = require('./aiService');
const search = require('./kbSearchService');

async function log(ticketId, traceId, actor, action, meta){
  await AuditLog.create({ticketId, traceId, actor, action, meta});
}

exports.processTicket = async (ticketId)=>{
  const traceId = uuidv4();
  await log(ticketId, traceId, 'system', 'AGENT_STARTED');
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return;

  // Classify
  const cls = await ai.classify(`${ticket.title}\n${ticket.description}`);
  await log(ticketId, traceId, 'system', 'AGENT_CLASSIFIED', cls);

  // Retrieve KB
  const KBItems = await search.searchTop(ticket.description, cls.predictedCategory);
  await log(ticketId, traceId, 'system', 'KB_RETRIEVED', {KBItemIds: KBItems.map(a=>a._id)});

  // Draft
  const draft = await ai.draft(ticket.description, KBItems);
  await log(ticketId, traceId, 'system', 'DRAFT_GENERATED');

  const suggestion = await AgentSuggestion.create({
    ticketId,
    predictedCategory: cls.predictedCategory,
    KBItemIds: KBItems.map(a=>a._id),
    draftReply: draft.draftReply,
    confidence: cls.confidence,
    modelInfo: { provider: process.env.STUB_MODE==='true'?'stub':'openai', promptVersion: 'v1' }
  });

  const cfgDoc = await Config.findOne();
  const cfg = cfgDoc || { autoCloseEnabled:true, confidenceThreshold:0.78 };
  if (cfg.autoCloseEnabled && cls.confidence >= cfg.confidenceThreshold){
    await Ticket.findByIdAndUpdate(ticketId,{ status:'resolved', agentSuggestionId: suggestion._id, category: cls.predictedCategory });
    await AgentSuggestion.findByIdAndUpdate(suggestion._id,{ autoClosed:true });
    await log(ticketId, traceId, 'system', 'AUTO_CLOSED', {suggestionId: suggestion._id});
  } else {
    await Ticket.findByIdAndUpdate(ticketId,{ status:'waiting_human', agentSuggestionId: suggestion._id, category: cls.predictedCategory });
    await log(ticketId, traceId, 'system', 'ASSIGNED_TO_HUMAN', {suggestionId: suggestion._id});
  }
};
