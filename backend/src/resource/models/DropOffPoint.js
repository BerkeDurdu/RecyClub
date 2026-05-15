const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class DropOffPoint extends Model {}

DropOffPoint.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
    acceptedTypes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, modelName: 'DropOffPoint', tableName: 'drop_off_points', timestamps: true }
);

module.exports = DropOffPoint;
