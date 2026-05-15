const RewardService = require('../../domain/services/RewardService');
const { Business } = require('../../resource/models');
const AppError = require('../../common/AppError');

async function listAvailable(req, res, next) {
  try {
    const rewards = await RewardService.listAvailable({ maxPointCost: req.query.maxPointCost });
    res.json(rewards);
  } catch (e) { next(e); }
}

async function listMine(req, res, next) {
  try {
    const business = await Business.findOne({ where: { userId: req.user.id } });
    if (!business) throw new AppError('Business profile not found', 404);
    const rewards = await RewardService.listForBusiness(business.id);
    res.json(rewards);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const business = await Business.findOne({ where: { userId: req.user.id } });
    if (!business) throw new AppError('Business profile not found', 404);
    const reward = await RewardService.create({ businessId: business.id, ...req.body });
    res.status(201).json(reward);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const business = await Business.findOne({ where: { userId: req.user.id } });
    if (!business) throw new AppError('Business profile not found', 404);
    const reward = await RewardService.update(req.params.id, business.id, req.body);
    res.json(reward);
  } catch (e) { next(e); }
}

module.exports = { listAvailable, listMine, create, update };
