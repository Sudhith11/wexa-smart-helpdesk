const mongoose = require('mongoose');

const kbItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('KBItem', kbItemSchema);
