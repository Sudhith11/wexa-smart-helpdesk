const AgentSuggestion = require('../models/AgentSuggestion');
const Config = require('../models/Config');
const Ticket = require('../models/Ticket');

exports.getSuggestion = async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId).select('createdBy');

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  if (req.user.role === 'user' && String(ticket.createdBy) !== req.user.id) {
    return res.status(403).json({ message: 'You do not have access to this ticket.' });
  }

  const suggestion = await AgentSuggestion.findOne({ ticketId: req.params.ticketId }).populate(
    'KBItemIds',
    'title tags'
  );

  res.json(suggestion);
};

exports.getConfig = async (req, res) => {
  let config = await Config.findOne();

  if (!config) {
    config = await Config.create({});
  }

  res.json(config);
};

exports.updateConfig = async (req, res) => {
  let config = await Config.findOne();

  if (!config) {
    config = new Config();
  }

  if (typeof req.body.autoClose === 'boolean') {
    config.autoClose = req.body.autoClose;
  }

  if (req.body.threshold !== undefined) {
    const threshold = Number(req.body.threshold);

    if (Number.isNaN(threshold) || threshold < 0 || threshold > 1) {
      return res.status(400).json({ message: 'Threshold must be between 0 and 1.' });
    }

    config.threshold = threshold;
  }

  await config.save();
  res.json(config);
};
