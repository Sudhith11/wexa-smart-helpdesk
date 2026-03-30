const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  actor: { type: String, default: 'system' },
  action: { type: String, required: true },
  traceId: { type: String, required: true },
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
