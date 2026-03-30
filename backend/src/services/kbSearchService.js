const KBItem = require('../models/KBItem');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.searchTop = async (query, category) => {
  const terms = (query || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map(escapeRegex);
  const filter = { status: 'published' };

  if (terms.length) {
    const regex = new RegExp(terms.join('|'), 'i');
    filter.$or = [{ title: regex }, { body: regex }, { tags: regex }];
  }

  if (category && category !== 'other') {
    filter.tags = { $in: [category] };
  }

  return KBItem.find(filter).sort('-updatedAt').limit(3);
};
