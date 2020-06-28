const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('passport');
const passportConfig = require('../configs/passport');

router.post(
  '/signIn',
  passport.authenticate('signin', { session: false }),
  controller.signIn
);
router.post(
  '/signUp',
  passport.authenticate('signup', { session: false }),
  controller.signUp
);
router.post(
  '/google',
  passport.authenticate('auth-google', { session: false }),
  controller.authGoogle
);
router.post(
  '/facebook',
  passport.authenticate('auth-facebook', { session: false }),
  controller.authFacebook
);

module.exports = router;
