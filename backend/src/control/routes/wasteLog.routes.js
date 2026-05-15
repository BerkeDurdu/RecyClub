const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const c = require('../controllers/WasteLogController');

router.post('/', auth, requireRole('MEMBER'), c.create);             // UC-03
router.post('/validate', auth, requireRole('MEMBER', 'ADMIN'), c.validate); // UC-04
router.get('/mine', auth, requireRole('MEMBER'), c.listMine);        // UC-05

module.exports = router;
