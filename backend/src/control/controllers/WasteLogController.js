const WasteLogService = require('../../domain/services/WasteLogService');
const { require_ } = require('../../common/dto');

async function create(req, res, next) {
  try {
    require_(req.body, ['wasteType', 'quantity']);
    const log = await WasteLogService.createLog({
      userId: req.user.id,
      wasteType: req.body.wasteType,
      quantity: req.body.quantity,
      dropOffPointId: req.body.dropOffPointId,
    });
    res.status(201).json(log);
  } catch (e) { next(e); }
}

async function validate(req, res, next) {
  try {
    require_(req.body, ['qrCode']);
    const result = await WasteLogService.validateLog({
      qrCode: req.body.qrCode,
      dropOffPointId: req.body.dropOffPointId,
    });
    res.json(result);
  } catch (e) { next(e); }
}

async function listMine(req, res, next) {
  try {
    const logs = await WasteLogService.listForUser(req.user.id);
    res.json(logs);
  } catch (e) { next(e); }
}

module.exports = { create, validate, listMine };
