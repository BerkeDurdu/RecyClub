const RedemptionService = require('../../domain/services/RedemptionService');
const { require_ } = require('../../common/dto');

async function redeem(req, res, next) {
  try {
    require_(req.body, ['rewardId']);
    const r = await RedemptionService.redeem({ userId: req.user.id, rewardId: req.body.rewardId });
    res.status(201).json(r);
  } catch (e) { next(e); }
}

async function validateAtBusiness(req, res, next) {
  try {
    require_(req.body, ['qrCode']);
    const r = await RedemptionService.validateAtBusiness({
      qrCode: req.body.qrCode,
      businessUserId: req.user.id,
    });
    res.json(r);
  } catch (e) { next(e); }
}

async function listMine(req, res, next) {
  try {
    const r = await RedemptionService.listForUser(req.user.id);
    res.json(r);
  } catch (e) { next(e); }
}

module.exports = { redeem, validateAtBusiness, listMine };
