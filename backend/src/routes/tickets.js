const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/ticketController');

// Create ticket
router.post('/', auth, ctrl.create);

// List tickets for current user
router.get('/', auth, ctrl.list);

// Ticket detail (with suggestions & audit logs populated in controller)
router.get('/:id', auth, ctrl.get);

// Audit timeline only (if frontend needs it separately)
router.get('/:id/audit', auth, ctrl.audit);

// Agent/admin-only actions
router.post('/:id/reply', auth, requireRole('agent', 'admin'), ctrl.reply);
router.post('/:id/assign', auth, requireRole('agent', 'admin'), ctrl.assign);

module.exports = router;
