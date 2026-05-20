// Resource layer adapter for Notification Service (SAD §3.4)
// Fire-and-forget async email dispatch (SAD §4.4)
const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  const port = Number(process.env.SMTP_PORT) || 587;
  // Port 465 uses implicit TLS; 587/25 use STARTTLS. Override with SMTP_SECURE if needed.
  const secure = process.env.SMTP_SECURE != null
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[MAIL:dev-stub] to=${to} subject="${subject}"`);
    return Promise.resolve({ stub: true });
  }
  return t.sendMail({ from: process.env.MAIL_FROM || 'noreply@recyclub.local', to, subject, text, html });
}

module.exports = { sendMail };
