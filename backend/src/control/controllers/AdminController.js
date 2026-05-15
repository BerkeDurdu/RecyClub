const AdminService = require('../../domain/services/AdminService');

async function users(_req, res, next) {
  try { res.json(await AdminService.listUsers()); } catch (e) { next(e); }
}
async function flagUser(req, res, next) {
  try { res.json(await AdminService.flagUser(req.params.id, req.body.isFlagged)); } catch (e) { next(e); }
}
async function complaints(_req, res, next) {
  try { res.json(await AdminService.listComplaints()); } catch (e) { next(e); }
}
async function resolveComplaint(req, res, next) {
  try { res.json(await AdminService.resolveComplaint(req.params.id, req.body)); } catch (e) { next(e); }
}
async function verifyBusiness(req, res, next) {
  try { res.json(await AdminService.verifyBusiness(req.params.id, req.body.isVerified)); } catch (e) { next(e); }
}

module.exports = { users, flagUser, complaints, resolveComplaint, verifyBusiness };
