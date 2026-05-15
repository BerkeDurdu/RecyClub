const sequelize = require('../../../config/database');

const User = require('./User');
const WasteLog = require('./WasteLog');
const DropOffPoint = require('./DropOffPoint');
const Business = require('./Business');
const Reward = require('./Reward');
const Redemption = require('./Redemption');
const Badge = require('./Badge');
const Complaint = require('./Complaint');

// ----- Associations (SAD §3.3) -----

// User has many WasteLogs / Redemptions / Badges
User.hasMany(WasteLog, { foreignKey: 'userId', as: 'wasteLogs' });
WasteLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Redemption, { foreignKey: 'userId', as: 'redemptions' });
Redemption.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Badge, { foreignKey: 'userId', as: 'badges' });
Badge.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// DropOffPoint has many WasteLogs
DropOffPoint.hasMany(WasteLog, { foreignKey: 'dropOffPointId', as: 'wasteLogs' });
WasteLog.belongsTo(DropOffPoint, { foreignKey: 'dropOffPointId', as: 'dropOffPoint' });

// User <-> Business (1:1, owner)
User.hasOne(Business, { foreignKey: 'userId', as: 'business' });
Business.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Business has many Rewards
Business.hasMany(Reward, { foreignKey: 'businessId', as: 'rewards' });
Reward.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });

// Reward has many Redemptions
Reward.hasMany(Redemption, { foreignKey: 'rewardId', as: 'redemptions' });
Redemption.belongsTo(Reward, { foreignKey: 'rewardId', as: 'reward' });

// Business validates Redemptions
Business.hasMany(Redemption, { foreignKey: 'validatedByBusinessId', as: 'validatedRedemptions' });
Redemption.belongsTo(Business, { foreignKey: 'validatedByBusinessId', as: 'validatingBusiness' });

module.exports = {
  sequelize,
  User,
  WasteLog,
  DropOffPoint,
  Business,
  Reward,
  Redemption,
  Badge,
  Complaint,
};
