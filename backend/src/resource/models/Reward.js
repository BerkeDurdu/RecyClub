const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class Reward extends Model {}

Reward.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    pointCost: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: 'Reward', tableName: 'rewards', timestamps: true }
);

module.exports = Reward;
