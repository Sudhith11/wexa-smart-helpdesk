const KBItem = require('../models/KBItem');

exports.search = async (req,res)=>{
  const q = req.query.query || '';
  const regex = new RegExp(q,'i');
  const results = await KBItem.find({
    $or: [{title:regex},{body:regex},{tags:regex}],
    status: 'published'
  }).limit(10);
  res.json(results);
};

exports.create = async (req,res)=>{
  const {title,body,tags,status} = req.body;
  const doc = await KBItem.create({title,body,tags,status: status || 'draft'});
  res.status(201).json(doc);
};

exports.update = async (req,res)=>{
  const {id} = req.params;
  const doc = await KBItem.findByIdAndUpdate(id, req.body, {new:true});
  res.json(doc);
};

exports.remove = async (req,res)=>{
  const {id} = req.params;
  await KBItem.findByIdAndDelete(id);
  res.json({ok:true});
};
