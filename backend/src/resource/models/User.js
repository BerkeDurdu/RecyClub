const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('MEMBER', 'BUSINESS', 'ADMIN'), allowNull: false, defaultValue: 'MEMBER' },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isFlagged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: 'User', tableName: 'users', timestamps: true }
);

module.exports = User;
