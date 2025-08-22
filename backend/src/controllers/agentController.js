const AgentSuggestion = require('../models/AgentSuggestion');
const Config = require('../models/Config');

exports.getSuggestion = async (req, res) => {
  const s = await AgentSuggestion.findOne({ ticketId: req.params.ticketId });
  res.json(s);
};

exports.getConfig = async (req, res) => {
  let config = await Config.findOne();
  if (!config) {
    config = new Config(); // default values
    await config.save();
  }
  res.json(config);
};

exports.updateConfig = async (req, res) => {
  let config = await Config.findOne();
  if (!config) {
    config = new Config();
  }
  const { autoClose, threshold } = req.body;
  config.autoClose = autoClose;
  config.threshold = threshold;
  await config.save();
  res.json(config);
};
