const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const c = require('../controllers/RedemptionController');

router.post('/', auth, requireRole('MEMBER'), c.redeem);                 // UC-07
router.post('/validate', auth, requireRole('BUSINESS'), c.validateAtBusiness); // UC-08
router.get('/mine', auth, requireRole('MEMBER'), c.listMine);

module.exports = router;
