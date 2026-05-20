// RedemptionService — atomic point deduction + Reward stock decrement (SAD §1.5, §4.4)
const { sequelize, User, Reward, Redemption, Business } = require('../../resource/models');
const { generateQR } = require('../../resource/clients/qrClient');
const { sendMail } = require('../../resource/clients/emailClient');
const AppError = require('../../common/AppError');

async function redeem({ userId, rewardId }) {
  const { code, dataUrl } = await generateQR('REWARD');

  const result = await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new AppError('User not found', 404);

    const reward = await Reward.findByPk(rewardId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!reward || !reward.isActive) throw new AppError('Reward unavailable', 404);
    if (reward.stock <= 0) throw new AppError('Reward out of stock', 409);
    if (user.points < reward.pointCost) throw new AppError('Insufficient points', 402);

    user.points -= reward.pointCost;
    reward.stock -= 1;
    await user.save({ transaction: t });
    await reward.save({ transaction: t });

    const redemption = await Redemption.create(
      {
        userId,
        rewardId,
        pointsSpent: reward.pointCost,
        qrCode: code,
        qrImage: dataUrl,
        status: 'PENDING',
      },
      { transaction: t }
    );

    return { redemption, user, reward };
  });

  sendMail({
    to: result.user.email,
    subject: 'RecyClub — Reward redeemed',
    text: `You redeemed "${result.reward.title}" for ${result.reward.pointCost} points. Show this QR at the partner: ${code}`,
  }).catch((e) => console.warn('[mail] failed:', e.message));

  return result.redemption;
}

async function validateAtBusiness({ qrCode, businessUserId }) {
  return sequelize.transaction(async (t) => {
    const business = await Business.findOne({ where: { userId: businessUserId }, transaction: t });
    if (!business) throw new AppError('Business profile not found', 404);

    // Lock only the redemption row; Postgres rejects FOR UPDATE combined with
    // the LEFT OUTER JOIN that an `include` would generate, so fetch the reward
    // separately instead of joining it into the locked query.
    const redemption = await Redemption.findOne({
      where: { qrCode },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!redemption) throw new AppError('Invalid QR code', 404);
    if (redemption.status !== 'PENDING') throw new AppError(`Already ${redemption.status}`, 409);

    const reward = await Reward.findByPk(redemption.rewardId, { transaction: t });
    if (!reward || reward.businessId !== business.id) {
      throw new AppError('Redemption does not belong to this business', 403);
    }

    redemption.status = 'VALIDATED';
    redemption.validatedAt = new Date();
    redemption.validatedByBusinessId = business.id;
    await redemption.save({ transaction: t });
    return { ...redemption.toJSON(), reward };
  });
}

async function listForUser(userId) {
  return Redemption.findAll({
    where: { userId },
    include: [{ model: Reward, as: 'reward' }],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = { redeem, validateAtBusiness, listForUser };
