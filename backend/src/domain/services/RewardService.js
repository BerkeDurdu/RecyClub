const { Reward, Business } = require('../../resource/models');
const AppError = require('../../common/AppError');

async function listAvailable({ maxPointCost } = {}) {
  const where = { isActive: true };
  if (maxPointCost) where.pointCost = { [require('sequelize').Op.lte]: Number(maxPointCost) };
  return Reward.findAll({
    where,
    include: [{ model: Business, as: 'business', attributes: ['id', 'name', 'address'] }],
    order: [['pointCost', 'ASC']],
  });
}

async function listForBusiness(businessId) {
  return Reward.findAll({ where: { businessId }, order: [['createdAt', 'DESC']] });
}

async function create({ businessId, title, description, pointCost, stock }) {
  if (!title || !pointCost) throw new AppError('title and pointCost required', 400);
  return Reward.create({ businessId, title, description, pointCost, stock: stock || 0, isActive: true });
}

async function update(id, businessId, patch) {
  const reward = await Reward.findOne({ where: { id, businessId } });
  if (!reward) throw new AppError('Reward not found', 404);
  Object.assign(reward, patch);
  await reward.save();
  return reward;
}

module.exports = { listAvailable, listForBusiness, create, update };
