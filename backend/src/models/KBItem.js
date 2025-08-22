const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  tags: [{type:String}],
  status: {type:String, enum:['draft','published'], default:'draft'}
},{timestamps:true});
module.exports = mongoose.model('Article', articleSchema);
