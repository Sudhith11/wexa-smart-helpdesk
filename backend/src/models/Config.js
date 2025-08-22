const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  autoClose: { type: Boolean, default: true },
  threshold: { type: Number, default: 0.78 }
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
