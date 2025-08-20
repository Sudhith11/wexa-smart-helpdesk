const Ticket = require('../models/Ticket');
const AgentSuggestion = require('../models/AgentSuggestion');
const AuditLog = require('../models/AuditLog');
const {processTicket} = require('../services/agentService');

exports.create = async (req,res)=>{
  const {title, description, category} = req.body;
  if(!title || !description) return res.status(400).json({error:'Missing fields'});
  const ticket = await Ticket.create({title, description, category: category || 'other', createdBy: req.user.id});
  await AuditLog.create({ticketId: ticket._id, traceId: ticket._id.toString(), actor:'user', action:'TICKET_CREATED'});
  processTicket(ticket._id); // async, fire-and-forget
  res.status(201).json(ticket);
};

exports.list = async (req,res)=>{
  const mine = req.query.mine === 'true';
  const filter = mine ? { createdBy: req.user.id } : {};
  if (req.query.status) filter.status = req.query.status;
  const tickets = await Ticket.find(filter).sort('-createdAt');
  res.json(tickets);
};

exports.get = async (req,res)=>{
  const t = await Ticket.findById(req.params.id);
  if (!t) return res.status(404).json({error:'Not found'});
  res.json(t);
};

exports.reply = async (req,res)=>{
  const {message, status} = req.body;
  await AuditLog.create({ticketId: req.params.id, traceId: req.params.id, actor:'agent', action:'REPLY_SENT', meta:{message}});
  if (status) await Ticket.findByIdAndUpdate(req.params.id, {status});
  res.json({ok:true});
};

exports.assign = async (req,res)=>{
  const {assigneeId} = req.body;
  await Ticket.findByIdAndUpdate(req.params.id, {assignee: assigneeId});
  await AuditLog.create({ticketId: req.params.id, traceId: req.params.id, actor:'agent', action:'ASSIGNED', meta:{assigneeId}});
  res.json({ok:true});
};

exports.audit = async (req,res)=>{
  const logs = await AuditLog.find({ticketId: req.params.id}).sort('createdAt');
  res.json(logs);
};
