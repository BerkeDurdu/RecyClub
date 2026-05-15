const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/AuthController');

router.post('/register', c.register); // UC-01
router.post('/login', c.login);       // UC-01
router.get('/me', auth, c.me);

module.exports = router;
