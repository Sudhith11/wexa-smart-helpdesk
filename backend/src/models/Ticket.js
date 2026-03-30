const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['billing', 'tech', 'shipping', 'other'],
    default: 'other'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  agentSuggestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgentSuggestion',
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'waiting_human', 'resolved'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
