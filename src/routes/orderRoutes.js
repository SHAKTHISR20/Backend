const router = require('express').Router();
const auth = require('../middleware/authMiddleware'); 
const c = require('../controllers/orderController');
router.get('/', auth, c.list); 
router.get('/:id', auth, c.get);
module.exports = router;
