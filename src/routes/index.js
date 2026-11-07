const router = require('express').Router();
router.use('/users', require('./userRoutes'));
router.use('/coins', require('./coinRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/cash', require('./cashRoutes'));
module.exports = router;
