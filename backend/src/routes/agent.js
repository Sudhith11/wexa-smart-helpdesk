const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/agentController');

// Existing suggestion endpoint
router.get('/suggestion/:ticketId', auth, ctrl.getSuggestion);

// New: GET /api/agent/config (admin only)
router.get('/config', auth, requireRole('admin'), ctrl.getConfig);

// New: PUT /api/agent/config (admin only)
router.put('/config', auth, requireRole('admin'), ctrl.updateConfig);

module.exports = router;
