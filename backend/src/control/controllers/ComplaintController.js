const ComplaintService = require('../../domain/services/ComplaintService');

async function create(req, res, next) {
  try {
    const c = await ComplaintService.create({ userId: req.user.id, ...req.body });
    res.status(201).json(c);
  } catch (e) { next(e); }
}

async function listMine(req, res, next) {
  try { res.json(await ComplaintService.listForUser(req.user.id)); } catch (e) { next(e); }
}

module.exports = { create, listMine };
