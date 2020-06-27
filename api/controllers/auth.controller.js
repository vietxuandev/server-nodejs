const JWT = require('jsonwebtoken');

const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: 'vietxuandev.com',
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    process.env.SECRET_KEY
  );
};

module.exports.signUp = async (req, res) => {
  const token = encodedToken(req.user._id);
  res.setHeader('Authorization', token);
  return res.status(201).json({ success: true });
};

module.exports.signIn = async (req, res) => {
  const token = encodedToken(req.user._id);
  res.setHeader('Authorization', token);
  return res.status(200).json({ success: true });
};

module.exports.authFacebook = async (req, res, next) => {
  const token = encodedToken(req.user._id);
  res.setHeader('Authorization', token);
  return res.status(200).json({ success: true });
};

module.exports.authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id);
  res.setHeader('Authorization', token);
  return res.status(200).json({ success: true });
};
