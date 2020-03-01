const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, dataUser) => {
      if (err) {
        res.status(403).json({ message: 'Unauthorization' });
      } else {
        req.dataUser = dataUser;
        next();
      }
    });
  } else {
    res.status(403).json({ message: 'Token does not exist' });
  }
};
