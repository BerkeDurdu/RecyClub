const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const c = require('../controllers/DropOffPointController');

router.get('/', c.listPublic);                                       // UC-02 (Member, Guest)
router.get('/all', auth, requireRole('ADMIN'), c.listAll);
router.post('/', auth, requireRole('ADMIN'), c.create);              // UC-09
router.patch('/:id', auth, requireRole('ADMIN'), c.update);          // UC-09
router.delete('/:id', auth, requireRole('ADMIN'), c.deactivate);     // UC-09

module.exports = router;
