const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports.signUp = (req, res) => {
  const newUser = new User(req.body);
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hashPassword = undefined;
      return res.json(user);
    }
  });
};

module.exports.signIn = (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res
          .status(401)
          .json({ message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (!user.comparePassword(req.body.password)) {
          res
            .status(401)
            .json({ message: 'Authentication failed. Wrong password.' });
        } else {
          jwt.sign(
            {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              _id: user._id
            },
            process.env.SECRET_KEY,
            { expiresIn: '30s' },
            (err, token) => {
              if (err) {
                res.json({ err });
              } else {
                res.json({ token });
              }
            }
          );
        }
      }
    }
  );
};
