const router = require('express').Router();
const {auth, requireRole} = require('../middleware/auth');
const ctrl = require('../controllers/ticketController');

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.get('/:id/audit', auth, ctrl.audit);
router.post('/:id/reply', auth, requireRole('agent','admin'), ctrl.reply);
router.post('/:id/assign', auth, requireRole('agent','admin'), ctrl.assign);

module.exports = router;
