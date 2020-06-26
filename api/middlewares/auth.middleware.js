module.exports = (req, res, next) => {
  if (req.dataUser) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized user!' });
  }
};
