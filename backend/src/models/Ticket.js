const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['new', 'waiting_human', 'resolved'],
    default: 'new'
  },
  suggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentSuggestion' }],
  auditLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
