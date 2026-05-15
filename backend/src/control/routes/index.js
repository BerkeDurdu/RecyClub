const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/waste-logs', require('./wasteLog.routes'));
router.use('/drop-off-points', require('./dropOffPoint.routes'));
router.use('/rewards', require('./reward.routes'));
router.use('/redemptions', require('./redemption.routes'));
router.use('/complaints', require('./complaint.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
