const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const c = require('../controllers/AdminController');

router.use(auth, requireRole('ADMIN'));

router.get('/users', c.users);                                        // UC-11
router.patch('/users/:id/flag', c.flagUser);                          // UC-11
router.get('/complaints', c.complaints);                              // UC-11
router.patch('/complaints/:id', c.resolveComplaint);                  // UC-11
router.patch('/businesses/:id/verify', c.verifyBusiness);

module.exports = router;
