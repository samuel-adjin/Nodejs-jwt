const express = require('express');
const router = express.Router();
const {signUp,login,emailVerified} = require('../controllers/auth');



router.route('/login').post(login);
router.route('/register').post(signUp);
router.route('/verify-email').post(emailVerified);

module.exports = router;