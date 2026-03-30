const KBItem = require('../models/KBItem');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

exports.search = async (req, res) => {
  const q = (req.query.query || '').trim();
  const filter = {};

  if (req.user.role !== 'admin') {
    filter.status = 'published';
  }

  if (q) {
    const regex = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: regex }, { body: regex }, { tags: regex }];
  }

  const results = await KBItem.find(filter).sort('-updatedAt').limit(10);
  res.json(results);
};

exports.create = async (req, res) => {
  const { title, body, tags, status } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and article body are required.' });
  }

  const doc = await KBItem.create({
    title: title.trim(),
    body: body.trim(),
    tags: normalizeTags(tags),
    status: status === 'published' ? 'published' : 'draft',
  });

  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };

  if (payload.tags !== undefined) {
    payload.tags = normalizeTags(payload.tags);
  }

  if (payload.status && !['draft', 'published'].includes(payload.status)) {
    return res.status(400).json({ message: 'Invalid article status.' });
  }

  const doc = await KBItem.findByIdAndUpdate(id, payload, { new: true });

  if (!doc) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  res.json(doc);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const removed = await KBItem.findByIdAndDelete(id);

  if (!removed) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  res.json({ ok: true });
};
