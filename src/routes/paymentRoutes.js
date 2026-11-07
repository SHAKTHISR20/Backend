const router = require('express').Router(); 
const auth = require('../middleware/authMiddleware'); 
const c = require('../controllers/paymentController');
router.post('/webhook', c.webhook); 
router.post('/orders', auth, c.create); 
router.get('/orders/:orderId/status', auth, c.status);
module.exports = router;
