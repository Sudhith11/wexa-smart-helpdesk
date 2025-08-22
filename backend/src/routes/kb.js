const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { search, create, update, remove } = require('../controllers/kbController');

router.get('/', auth, search);
router.post('/', auth, requireRole('admin'), create);
router.put('/:id', auth, requireRole('admin'), update);
router.delete('/:id', auth, requireRole('admin'), remove);

module.exports = router;
