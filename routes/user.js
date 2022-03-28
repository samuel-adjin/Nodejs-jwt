const express = require('express');
const router = express.Router();
const { showAllUsers,token } = require('../controllers/user');
const verifyToken = require('../middleware/authMiddleware')

router.route('/').get(verifyToken,showAllUsers);
router.route('/token').post(token);

module.exports = router;