require('dotenv').config();
const { sendMail } = require('../src/resource/clients/emailClient');

const to = process.argv[2] || process.env.SMTP_USER;

(async () => {
  if (!process.env.SMTP_HOST) {
    console.error('SMTP_HOST is not set in .env');
    process.exit(1);
  }
  console.log(`Sending test mail via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} to ${to} ...`);
  try {
    const info = await sendMail({
      to,
      subject: 'RecyClub SMTP test',
      text: 'If you can read this, Nodemailer SMTP is working.',
    });
    console.log('OK:', info.messageId || info);
    process.exit(0);
  } catch (e) {
    console.error('FAILED:', e.message);
    process.exit(1);
  }
})();
