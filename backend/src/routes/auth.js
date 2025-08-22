const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Existing routes
router.post('/register', register);
router.post('/login', login);

// New: GET /api/auth/me → return current user
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
