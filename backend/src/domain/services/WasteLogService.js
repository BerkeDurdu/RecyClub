// WasteLogService — orchestrates the Recycling Log Flow (SAD §2.4)
const { sequelize, User, WasteLog, DropOffPoint } = require('../../resource/models');
const PointService = require('./PointService');
const BadgeService = require('./BadgeService');
const { generateQR } = require('../../resource/clients/qrClient');
const { sendMail } = require('../../resource/clients/emailClient');
const { WASTE_TYPES } = require('../../common/dto');
const AppError = require('../../common/AppError');

async function createLog({ userId, wasteType, quantity, dropOffPointId }) {
  if (!WASTE_TYPES.includes(wasteType)) throw new AppError('Invalid wasteType', 400);
  if (!(Number(quantity) > 0)) throw new AppError('quantity must be > 0', 400);

  const points = PointService.calculatePoints(wasteType, quantity);
  const { code, dataUrl } = await generateQR('WASTE');

  // SAD §2.4 step 5: atomic INSERT WasteLog + UPDATE User.points
  const result = await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new AppError('User not found', 404);

    if (dropOffPointId) {
      const dop = await DropOffPoint.findByPk(dropOffPointId, { transaction: t });
      if (!dop || !dop.isActive) throw new AppError('Drop-off point inactive', 400);
    }

    const log = await WasteLog.create(
      {
        userId,
        wasteType,
        quantity,
        dropOffPointId: dropOffPointId || null,
        pointsAwarded: points,
        qrCode: code,
        qrImage: dataUrl,
        status: 'PENDING',
      },
      { transaction: t }
    );
    return { log, user };
  });

  // SAD §2.4 step 7: fire-and-forget confirmation email (non-blocking)
  sendMail({
    to: result.user.email,
    subject: 'RecyClub — Waste log received',
    text: `Your ${quantity}kg ${wasteType} log is registered. Pending QR validation at drop-off. Code: ${code}`,
  }).catch((e) => console.warn('[mail] failed:', e.message));

  return result.log;
}

async function validateLog({ qrCode, dropOffPointId }) {
  return sequelize.transaction(async (t) => {
    const log = await WasteLog.findOne({
      where: { qrCode },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!log) throw new AppError('Invalid QR code', 404);
    if (log.status !== 'PENDING') throw new AppError(`Log already ${log.status}`, 409);

    const user = await User.findByPk(log.userId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new AppError('User not found', 404);

    log.status = 'VALIDATED';
    log.validatedAt = new Date();
    if (dropOffPointId) log.dropOffPointId = dropOffPointId;
    await log.save({ transaction: t });

    user.points = user.points + log.pointsAwarded;
    await user.save({ transaction: t });

    const newBadges = await BadgeService.evaluate(user, t);

    return { log, points: user.points, newBadges };
  });
}

async function listForUser(userId) {
  return WasteLog.findAll({
    where: { userId },
    include: [{ model: DropOffPoint, as: 'dropOffPoint' }],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = { createLog, validateLog, listForUser };
