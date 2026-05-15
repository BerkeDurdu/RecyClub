require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./config/database');
require('./src/resource/models'); // register models & associations

const routes = require('./src/control/routes');
const errorHandler = require('./src/control/middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'recyclub-api' }));
app.use('/api', routes);

// Centralized error middleware (Common layer)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('[DB] Connected & synced');
    app.listen(PORT, () => console.log(`[API] Listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[FATAL] Startup failed:', err);
    process.exit(1);
  }
})();
