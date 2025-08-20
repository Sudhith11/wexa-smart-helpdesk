const Article = require('../models/Article');

exports.search = async (req,res)=>{
  const q = req.query.query || '';
  const regex = new RegExp(q,'i');
  const results = await Article.find({
    $or: [{title:regex},{body:regex},{tags:regex}],
    status: 'published'
  }).limit(10);
  res.json(results);
};

exports.create = async (req,res)=>{
  const {title,body,tags,status} = req.body;
  const doc = await Article.create({title,body,tags,status: status || 'draft'});
  res.status(201).json(doc);
};

exports.update = async (req,res)=>{
  const {id} = req.params;
  const doc = await Article.findByIdAndUpdate(id, req.body, {new:true});
  res.json(doc);
};

exports.remove = async (req,res)=>{
  const {id} = req.params;
  await Article.findByIdAndDelete(id);
  res.json({ok:true});
};
