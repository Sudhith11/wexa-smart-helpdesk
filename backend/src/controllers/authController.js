const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req,res)=>{
  const {name,email,password,role} = req.body;
  if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
  const exists = await User.findOne({email});
  if (exists) return res.status(409).json({error:'Email taken'});
  const user = await User.create({name,email,password,role: role || 'user'});
  const token = jwt.sign({id:user._id, role:user.role, email:user.email, name:user.name}, process.env.JWT_SECRET, {expiresIn:'1h'});
  res.status(201).json({user:{id:user._id,name:user.name,email:user.email,role:user.role}, token});
};

exports.login = async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const ok = await user.comparePassword(password);
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({id:user._id, role:user.role, email:user.email, name:user.name}, process.env.JWT_SECRET, {expiresIn:'1h'});
  res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role}, token});
};
