const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class WasteLog extends Model {}

WasteLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    dropOffPointId: { type: DataTypes.INTEGER, allowNull: true },
    wasteType: { type: DataTypes.ENUM('GLASS', 'PLASTIC', 'BATTERY', 'PAPER'), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // kg
    pointsAwarded: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    qrCode: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    qrImage: { type: DataTypes.TEXT, allowNull: true }, // data URL
    status: { type: DataTypes.ENUM('PENDING', 'VALIDATED', 'CANCELED'), allowNull: false, defaultValue: 'PENDING' },
    validatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'WasteLog',
    tableName: 'waste_logs',
    timestamps: true,
    indexes: [{ fields: ['qrCode'] }, { fields: ['userId'] }, { fields: ['status'] }],
  }
);

module.exports = WasteLog;
