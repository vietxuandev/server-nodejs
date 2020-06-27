require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const helmet = require('helmet');
const httpStatus = require('http-status');
const cors = require('cors');
require('./api/configs/passport');
// Import index route
const indexRoute = require('./api/routes/index.route');

// Set port server
const port = process.env.PORT || 3000;
// Create Express server
const app = express();
// Hide detail OS server
app.disable('x-powered-by');
// Secure Express apps
app.use(helmet());
// Enable CORS
app.use(cors());
// HTTP request logger middleware
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
  );

// Request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRoute);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const data = {
    message: err.isPublic ? err.message : httpStatus[status],
  };
  if (process.env.NODE_ENV === 'development') data.stack = err.stack;
  res.status(status).json(data);
});

// Listen port
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
