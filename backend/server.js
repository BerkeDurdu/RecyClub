require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./config/database');
require('./src/resource/models'); // register models & associations

const routes = require('./src/control/routes');
const errorHandler = require('./src/control/middleware/errorHandler');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('CORS blocked'))),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// SAD v2 §6.3 — readiness/liveness probe (includes DB ping)
app.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', service: 'recyclub-api', db: 'up' });
  } catch (e) {
    res.status(503).json({ status: 'degraded', service: 'recyclub-api', db: 'down', error: e.message });
  }
});

app.use('/api', routes);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

let server;

async function start() {
  try {
    await sequelize.authenticate();
    // SAD v2 §6.2 — alter only in non-production
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('[DB] Connected & synced');
    server = app.listen(PORT, () => console.log(`[API] Listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[FATAL] Startup failed:', err);
    process.exit(1);
  }
}

// Graceful shutdown — stop accepting connections, drain, close DB
async function shutdown(signal) {
  console.log(`[shutdown] ${signal} received`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log('[shutdown] HTTP server closed');
    }
    await sequelize.close();
    console.log('[shutdown] DB connection closed');
    process.exit(0);
  } catch (e) {
    console.error('[shutdown] error:', e);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Only auto-start when run directly (tests will import app without listening)
if (require.main === module) {
  start();
}

module.exports = app;
