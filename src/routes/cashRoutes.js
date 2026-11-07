const router = require('express').Router(); 
const auth = require('../middleware/authMiddleware'); 
const c = require('../controllers/cashController');
router.post('/withdrawal-requests', auth, c.requestWithdrawal); 
router.get('/withdrawal-requests/mine', auth, c.myRequests);
module.exports = router;
