const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  action: String,
  timestamp: { type: Date, default: Date.now },
  traceId: String,
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
