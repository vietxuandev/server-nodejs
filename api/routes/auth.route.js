const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('passport');
const passportConfig = require('../configs/passport');

router.post('/signIn', passport.authenticate('local', { session: false }), controller.signIn);
router.post('/signUp', controller.signUp);

module.exports = router;
