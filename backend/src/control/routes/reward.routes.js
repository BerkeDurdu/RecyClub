const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const c = require('../controllers/RewardController');

router.get('/', auth, c.listAvailable);                                  // UC-06 (Member)
router.get('/mine', auth, requireRole('BUSINESS'), c.listMine);          // UC-10
router.post('/', auth, requireRole('BUSINESS', 'ADMIN'), c.create);      // UC-10
router.patch('/:id', auth, requireRole('BUSINESS', 'ADMIN'), c.update);  // UC-10

module.exports = router;
