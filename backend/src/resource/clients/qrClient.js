// Resource layer adapter for QR Code Service (SAD §3.4)
const QRCode = require('qrcode');
const { v4: uuid } = require('uuid');

async function generateQR(payloadPrefix = 'RCY') {
  const code = `${payloadPrefix}-${uuid()}`;
  const dataUrl = await QRCode.toDataURL(code, { errorCorrectionLevel: 'M', margin: 1, width: 240 });
  return { code, dataUrl };
}

module.exports = { generateQR };
