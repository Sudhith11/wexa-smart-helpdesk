const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');
const { processTicket } = require('../services/agentService');

function isSupportUser(user) {
  return user.role === 'agent' || user.role === 'admin';
}

function canAccessTicket(user, ticket) {
  return isSupportUser(user) || String(ticket.createdBy?._id || ticket.createdBy) === user.id;
}

function populateTicket(query) {
  return query
    .populate('createdBy', 'name email role')
    .populate('assignee', 'name email role')
    .populate('agentSuggestionId');
}

function normalizeCategory(category) {
  return ['billing', 'tech', 'shipping', 'other'].includes(category) ? category : 'other';
}

exports.create = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const ticket = await Ticket.create({
    title: title.trim(),
    description: description.trim(),
    category: normalizeCategory(category),
    createdBy: req.user.id,
  });

  await AuditLog.create({
    ticketId: ticket._id,
    traceId: ticket._id.toString(),
    actor: req.user.role,
    action: 'TICKET_CREATED',
  });

  try {
    await processTicket(ticket._id);
  } catch {
    // Keep ticket creation successful even if the assistant workflow fails.
  }

  const hydratedTicket = await populateTicket(Ticket.findById(ticket._id));
  res.status(201).json(hydratedTicket);
};

exports.list = async (req, res) => {
  const mine = req.query.mine === 'true';
  const filter = {};

  if (req.user.role === 'user' || mine) {
    filter.createdBy = req.user.id;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const tickets = await populateTicket(Ticket.find(filter).sort('-updatedAt'));
  res.json(tickets);
};

exports.get = async (req, res) => {
  const ticket = await populateTicket(Ticket.findById(req.params.id));

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  if (!canAccessTicket(req.user, ticket)) {
    return res.status(403).json({ message: 'You do not have access to this ticket.' });
  }

  res.json(ticket);
};

exports.reply = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  const { message, status } = req.body;

  await AuditLog.create({
    ticketId: req.params.id,
    traceId: req.params.id,
    actor: req.user.role,
    action: 'REPLY_SENT',
    meta: { message },
  });

  if (status) {
    await Ticket.findByIdAndUpdate(req.params.id, { status });
  }

  res.json({ ok: true });
};

exports.assign = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  const { assigneeId } = req.body;

  if (!assigneeId) {
    return res.status(400).json({ message: 'Assignee is required.' });
  }

  await Ticket.findByIdAndUpdate(req.params.id, { assignee: assigneeId });
  await AuditLog.create({
    ticketId: req.params.id,
    traceId: req.params.id,
    actor: req.user.role,
    action: 'ASSIGNED',
    meta: { assigneeId },
  });

  res.json({ ok: true });
};

exports.audit = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found.' });
  }

  if (!canAccessTicket(req.user, ticket)) {
    return res.status(403).json({ message: 'You do not have access to this ticket.' });
  }

  const logs = await AuditLog.find({ ticketId: req.params.id }).sort('createdAt');
  res.json(logs);
};
