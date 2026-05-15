const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class Redemption extends Model {}

Redemption.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rewardId: { type: DataTypes.INTEGER, allowNull: false },
    pointsSpent: { type: DataTypes.INTEGER, allowNull: false },
    qrCode: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    qrImage: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('PENDING', 'VALIDATED', 'CANCELED'), allowNull: false, defaultValue: 'PENDING' },
    validatedAt: { type: DataTypes.DATE, allowNull: true },
    validatedByBusinessId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Redemption',
    tableName: 'redemptions',
    timestamps: true,
    indexes: [{ fields: ['qrCode'] }, { fields: ['userId'] }, { fields: ['status'] }],
  }
);

module.exports = Redemption;
