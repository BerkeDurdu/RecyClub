const DropOffPointService = require('../../domain/services/DropOffPointService');

async function listPublic(_req, res, next) {
  try { res.json(await DropOffPointService.listActive()); } catch (e) { next(e); }
}
async function listAll(_req, res, next) {
  try { res.json(await DropOffPointService.listAll()); } catch (e) { next(e); }
}
async function create(req, res, next) {
  try { res.status(201).json(await DropOffPointService.create(req.body)); } catch (e) { next(e); }
}
async function update(req, res, next) {
  try { res.json(await DropOffPointService.update(req.params.id, req.body)); } catch (e) { next(e); }
}
async function deactivate(req, res, next) {
  try { res.json(await DropOffPointService.deactivate(req.params.id)); } catch (e) { next(e); }
}

module.exports = { listPublic, listAll, create, update, deactivate };
