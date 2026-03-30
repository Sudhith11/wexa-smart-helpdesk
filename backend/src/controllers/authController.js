const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.findOne({ email: normalizedEmail });

  if (exists) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user',
  });

  res.status(201).json({ user: user.toSafeObject(), token: signToken(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const ok = await user.comparePassword(password);

  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({ user: user.toSafeObject(), token: signToken(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json({ user: user.toSafeObject() });
};
