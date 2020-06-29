const express = require('express');
const router = express.Router();
const passport = require('passport');
const authRoute = require('./auth.route');
const driveRoute = require('./drive.route');
/* GET home page. */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the api',
  });
});

router.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      message: 'Welcome to secret the api',
    });
  }
);

router.use('/auth', authRoute);
router.use('/drive', driveRoute);

module.exports = router;
