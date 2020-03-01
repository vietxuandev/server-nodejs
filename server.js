require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const loginRequired = require('./api/middlewares/auth.middleware');
// const verifyToken = require('./api/middlewares/token.middleware');
// const productRoute = require('./api/routes/product.route');
const authRoute = require('./api/routes/auth.route');

// Set port server
const port = process.env.PORT || 3000;

// Create Express server
const app = express();

// Connect mongoDB
mongoose.connect(process.env.MONGO_URL);

// Request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'welcome to the api'
  });
});

// Route Auth
app.use('/api/auth', authRoute);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Listen port
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
