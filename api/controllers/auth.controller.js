const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const encodedToken = (user) => {
  return JWT.sign(
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    },
    process.env.SECRET_KEY,
    { expiresIn: 360000 }
  );
};
module.exports.signUp = async (req, res) => {
  const token = encodedToken(req.user);
  return res.status(201).json({ token });
};

module.exports.signIn = (req, res) => {
  const token = encodedToken(req.user);
  return res.status(200).json({ token });
};
