const router = require('express').Router();
const {auth} = require('../middleware/auth');
const ctrl = require('../controllers/agentController');
router.get('/suggestion/:ticketId', auth, ctrl.getSuggestion);
module.exports = router;
