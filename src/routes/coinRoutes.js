const router = require('express').Router(); 
const auth = require('../middleware/authMiddleware'); 
const c = require('../controllers/coinController');
router.get('/wallet', auth, c.balance);
router.get('/wallet/history', auth, c.history);
module.exports = router;
