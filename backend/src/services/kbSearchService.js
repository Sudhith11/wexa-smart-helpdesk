const Article = require('../models/Article');

exports.searchTop = async (query, category) => {
  const q = (query||'').split(/\s+/).filter(Boolean).slice(0,5).join('|');
  const regex = q ? new RegExp(q,'i') : /.*/;
  const or = [{title:regex},{body:regex},{tags:regex}];
  const filter = { status:'published', $or: or };
  if (category && category!=='other') {
    filter.tags = { $in: [category] };
  }
  const results = await Article.find(filter).limit(3);
  return results;
};
