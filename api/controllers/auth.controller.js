const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')

const encodedToken = (userID) => {
  return JWT.sign({
    iss: 'Tran Toan',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}

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

module.exports.test = (req, res) => {
  const token = encodedToken(req.user._id)
  res.setHeader('Authorization', token)
  return res.status(200).json({ success: true })
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
          JWT.sign(
            {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              _id: user._id
            },
            process.env.SECRET_KEY,
            { expiresIn: 360000 },
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
