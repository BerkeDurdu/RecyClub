require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User, Business, Reward, DropOffPoint } = require('../src/resource/models');

(async () => {
  await sequelize.sync({ alter: true });

  const [admin] = await User.findOrCreate({
    where: { email: 'admin@recyclub.local' },
    defaults: {
      name: 'Admin',
      email: 'admin@recyclub.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const [bizUser] = await User.findOrCreate({
    where: { email: 'cafe@recyclub.local' },
    defaults: {
      name: 'Green Cafe Owner',
      email: 'cafe@recyclub.local',
      passwordHash: await bcrypt.hash('cafe123', 10),
      role: 'BUSINESS',
    },
  });

  const [biz] = await Business.findOrCreate({
    where: { userId: bizUser.id },
    defaults: { userId: bizUser.id, name: 'Green Cafe', email: 'cafe@recyclub.local', address: 'Bagdat Cad. 12, Istanbul', isVerified: true },
  });

  await Reward.findOrCreate({
    where: { businessId: biz.id, title: 'Filter Coffee' },
    defaults: { businessId: biz.id, title: 'Filter Coffee', description: 'Free filter coffee at Green Cafe', pointCost: 80, stock: 25, isActive: true },
  });
  await Reward.findOrCreate({
    where: { businessId: biz.id, title: 'Vegan Sandwich' },
    defaults: { businessId: biz.id, title: 'Vegan Sandwich', description: '%50 indirim', pointCost: 200, stock: 10, isActive: true },
  });

  await DropOffPoint.findOrCreate({
    where: { name: 'Kadikoy Recycling Center' },
    defaults: {
      name: 'Kadikoy Recycling Center', address: 'Moda Cad. 5, Kadikoy', latitude: 40.985, longitude: 29.025,
      acceptedTypes: ['GLASS', 'PLASTIC', 'PAPER', 'BATTERY'], isActive: true,
    },
  });
  await DropOffPoint.findOrCreate({
    where: { name: 'Besiktas Eco Hub' },
    defaults: {
      name: 'Besiktas Eco Hub', address: 'Barbaros Bulvari 42, Besiktas', latitude: 41.0425, longitude: 29.0075,
      acceptedTypes: ['PLASTIC', 'PAPER'], isActive: true,
    },
  });

  // demo member
  await User.findOrCreate({
    where: { email: 'member@recyclub.local' },
    defaults: {
      name: 'Demo Member', email: 'member@recyclub.local',
      passwordHash: await bcrypt.hash('member123', 10), role: 'MEMBER',
    },
  });

  console.log('[seed] Done. admin@recyclub.local / admin123 — member@recyclub.local / member123 — cafe@recyclub.local / cafe123');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
