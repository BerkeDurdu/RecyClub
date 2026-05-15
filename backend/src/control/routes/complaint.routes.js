const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/ComplaintController');

router.post('/', auth, c.create);
router.get('/mine', auth, c.listMine);

module.exports = router;
