const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class Complaint extends Model {}

Complaint.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING(160), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('OPEN', 'IN_REVIEW', 'CLOSED'), allowNull: false, defaultValue: 'OPEN' },
    resolution: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Complaint', tableName: 'complaints', timestamps: true }
);

module.exports = Complaint;
