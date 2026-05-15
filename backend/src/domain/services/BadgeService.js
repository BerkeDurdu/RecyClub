// BadgeService - awards milestone badges based on user activity
const { Badge, WasteLog } = require('../../resource/models');

const TIERS = [
  { type: 'ECO_LEGEND', minPoints: 1000 },
  { type: 'ECO_HERO', minPoints: 500 },
  { type: 'ECO_STARTER', minPoints: 100 },
];

async function evaluate(user, transaction) {
  const badges = [];
  const logCount = await WasteLog.count({ where: { userId: user.id }, transaction });
  if (logCount === 1) {
    const [, created] = await Badge.findOrCreate({
      where: { userId: user.id, type: 'FIRST_LOG' },
      defaults: { userId: user.id, type: 'FIRST_LOG' },
      transaction,
    });
    if (created) badges.push('FIRST_LOG');
  }
  for (const tier of TIERS) {
    if (user.points >= tier.minPoints) {
      const [, created] = await Badge.findOrCreate({
        where: { userId: user.id, type: tier.type },
        defaults: { userId: user.id, type: tier.type },
        transaction,
      });
      if (created) badges.push(tier.type);
    }
  }
  return badges;
}

module.exports = { evaluate };
