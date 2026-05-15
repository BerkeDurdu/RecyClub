const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class Badge extends Model {}

Badge.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM('FIRST_LOG', 'ECO_STARTER', 'ECO_HERO', 'ECO_LEGEND'),
      allowNull: false,
    },
    awardedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: 'Badge', tableName: 'badges', timestamps: true }
);

module.exports = Badge;
