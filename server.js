require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// const loginRequired = require('./api/middlewares/auth.middleware');
// const verifyToken = require('./api/middlewares/token.middleware');
// const productRoute = require('./api/routes/product.route');
const indexRoute = require('./api/routes/index.route');

// Set port server
const port = process.env.PORT || 3000;

// Create Express server
const app = express();

// Hide OS
app.disable('x-powered-by');

// Check status
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
// Connect mongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected database...'))
  .catch((error) =>
    console.error(`Connect database is failed with error which is ${error}`)
  )

// Request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRoute);

// Response not found api
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Listen port
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
