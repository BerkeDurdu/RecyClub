// PointService — business rule: points per kg by waste type (SAD §2.4 step 4)
const RATE_PER_KG = {
  GLASS: 5,
  PLASTIC: 8,
  BATTERY: 20,
  PAPER: 3,
};

function calculatePoints(wasteType, quantity) {
  const rate = RATE_PER_KG[wasteType];
  if (!rate) throw new Error(`Unknown wasteType: ${wasteType}`);
  const q = Number(quantity);
  if (!(q > 0)) throw new Error('quantity must be > 0');
  return Math.round(rate * q);
}

module.exports = { calculatePoints, RATE_PER_KG };
