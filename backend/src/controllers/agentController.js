const AgentSuggestion = require('../models/AgentSuggestion');

exports.getSuggestion = async (req,res)=>{
  const s = await AgentSuggestion.findOne({ticketId: req.params.ticketId});
  res.json(s);
};
