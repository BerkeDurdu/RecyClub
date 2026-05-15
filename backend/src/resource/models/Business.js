const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class Business extends Model {}

Business.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // owner User
    name: { type: DataTypes.STRING(160), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, validate: { isEmail: true } },
    address: { type: DataTypes.STRING(255), allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: 'Business', tableName: 'businesses', timestamps: true }
);

module.exports = Business;
