const router = require('express').Router();
const auth = require('../middleware/authMiddleware'); 
const controller = require('../controllers/userController');
router.get('/me', auth, controller.me); 
router.patch('/me', auth, controller.updateMe);
module.exports = router;
