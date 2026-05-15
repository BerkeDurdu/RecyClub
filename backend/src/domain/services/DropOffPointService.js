const { DropOffPoint } = require('../../resource/models');
const AppError = require('../../common/AppError');

async function listActive() {
  return DropOffPoint.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
}

async function listAll() {
  return DropOffPoint.findAll({ order: [['name', 'ASC']] });
}

async function create({ name, address, latitude, longitude, acceptedTypes }) {
  if (!name || !address || latitude == null || longitude == null) {
    throw new AppError('name, address, latitude, longitude required', 400);
  }
  return DropOffPoint.create({ name, address, latitude, longitude, acceptedTypes: acceptedTypes || [], isActive: true });
}

async function update(id, patch) {
  const dop = await DropOffPoint.findByPk(id);
  if (!dop) throw new AppError('Drop-off point not found', 404);
  Object.assign(dop, patch);
  await dop.save();
  return dop;
}

async function deactivate(id) {
  return update(id, { isActive: false });
}

module.exports = { listActive, listAll, create, update, deactivate };
