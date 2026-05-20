require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const {
  User, Business, Reward, DropOffPoint, WasteLog, Redemption, Complaint,
} = require('../src/resource/models');
const { generateQR } = require('../src/resource/clients/qrClient');

(async () => {
  await sequelize.sync({ alter: true });

  // --- Users (member / business / admin) ---
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
    defaults: {
      userId: bizUser.id, name: 'Green Cafe', email: 'cafe@recyclub.local',
      address: 'Bagdat Cad. 12, Istanbul', isVerified: true,
    },
  });

  const [member] = await User.findOrCreate({
    where: { email: 'member@recyclub.local' },
    defaults: {
      name: 'Demo Member', email: 'member@recyclub.local',
      passwordHash: await bcrypt.hash('member123', 10), role: 'MEMBER', points: 250,
    },
  });

  // --- Rewards (6 total) ---
  const rewardDefs = [
    { title: 'Filter Coffee',  description: 'Free filter coffee at Green Cafe', pointCost: 80,  stock: 25 },
    { title: 'Vegan Sandwich', description: '%50 discount',                     pointCost: 200, stock: 10 },
    { title: 'Eco Tote Bag',   description: 'Reusable tote bag',                pointCost: 120, stock: 30 },
    { title: 'Smoothie',       description: 'Fresh smoothie of the day',        pointCost: 90,  stock: 20 },
    { title: 'Cinema Ticket',  description: 'One ticket, partner cinema',       pointCost: 350, stock: 5  },
    { title: 'Reusable Cup',   description: 'Branded reusable cup',             pointCost: 150, stock: 40 },
  ];
  for (const r of rewardDefs) {
    await Reward.findOrCreate({
      where: { businessId: biz.id, title: r.title },
      defaults: { businessId: biz.id, isActive: true, ...r },
    });
  }

  // --- Drop-off points (5 total) ---
  const dopDefs = [
    { name: 'Kadikoy Recycling Center', address: 'Moda Cad. 5, Kadikoy',           latitude: 40.9850, longitude: 29.0250, acceptedTypes: ['GLASS','PLASTIC','PAPER','BATTERY'] },
    { name: 'Besiktas Eco Hub',         address: 'Barbaros Bulvari 42, Besiktas',  latitude: 41.0425, longitude: 29.0075, acceptedTypes: ['PLASTIC','PAPER'] },
    { name: 'Sisli Green Point',        address: 'Halaskargazi Cad. 220, Sisli',   latitude: 41.0590, longitude: 28.9870, acceptedTypes: ['GLASS','PLASTIC'] },
    { name: 'Uskudar Drop-off',         address: 'Salacak Sahil Yolu 8, Uskudar',  latitude: 41.0250, longitude: 29.0140, acceptedTypes: ['PAPER','BATTERY'] },
    { name: 'Atasehir Recycle Hub',     address: 'Barbaros Mh., Atasehir',         latitude: 40.9870, longitude: 29.1270, acceptedTypes: ['GLASS','PLASTIC','PAPER'] },
  ];
  const dropOffs = [];
  for (const d of dopDefs) {
    const [row] = await DropOffPoint.findOrCreate({
      where: { name: d.name },
      defaults: { isActive: true, ...d },
    });
    dropOffs.push(row);
  }

  // --- Demo WasteLog (validated) ---
  const existingLog = await WasteLog.findOne({ where: { userId: member.id } });
  if (!existingLog) {
    const { code, dataUrl } = await generateQR('WASTE');
    await WasteLog.create({
      userId: member.id,
      dropOffPointId: dropOffs[0].id,
      wasteType: 'PLASTIC',
      quantity: 2.5,
      pointsAwarded: 20,
      qrCode: code,
      qrImage: dataUrl,
      status: 'VALIDATED',
      validatedAt: new Date(),
    });
  }

  // --- Demo Redemption (pending) ---
  const someReward = await Reward.findOne({ where: { businessId: biz.id } });
  const existingRed = await Redemption.findOne({ where: { userId: member.id } });
  if (!existingRed && someReward) {
    const { code, dataUrl } = await generateQR('REDEEM');
    await Redemption.create({
      userId: member.id,
      rewardId: someReward.id,
      pointsSpent: someReward.pointCost,
      qrCode: code,
      qrImage: dataUrl,
      status: 'PENDING',
    });
  }

  // --- Demo Complaint ---
  await Complaint.findOrCreate({
    where: { userId: member.id, subject: 'Drop-off closed earlier than schedule' },
    defaults: {
      userId: member.id,
      subject: 'Drop-off closed earlier than schedule',
      body: 'I went to Kadikoy Recycling Center at 18:30 but it was already closed.',
      status: 'OPEN',
    },
  });

  console.log('[seed] Done.');
  console.log('  admin   → admin@recyclub.local  / admin123');
  console.log('  business→ cafe@recyclub.local   / cafe123');
  console.log('  member  → member@recyclub.local / member123');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
