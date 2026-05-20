// Resource layer adapter for QR Code Service (SAD §3.4)
const QRCode = require('qrcode');
const { v4: uuid } = require('uuid');

// The QR image encodes a deep link to the SPA scan page so that scanning
// with a phone opens the app and completes validation. The plain `code`
// is what is stored in the DB and looked up by the validate endpoints.
function scanLink(code) {
  const base = (process.env.PUBLIC_WEB_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${base}/scan?code=${encodeURIComponent(code)}`;
}

async function generateQR(payloadPrefix = 'RCY') {
  const code = `${payloadPrefix}-${uuid()}`;
  const link = scanLink(code);
  const dataUrl = await QRCode.toDataURL(link, { errorCorrectionLevel: 'M', margin: 1, width: 240 });
  return { code, link, dataUrl };
}

module.exports = { generateQR, scanLink };
