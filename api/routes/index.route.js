const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route')
const loginRequired = require('../middlewares/auth.middleware');
const verifyToken = require('../middlewares/token.middleware');
const productRoute = require('./product.route');
/* GET home page. */
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to the api'
    });
});

router.get('/ahihi', verifyToken, loginRequired, (req, res) => {
    res.status(200).json({
        message: 'welcome to the api'
    });
});

router.use('/auth', authRoute);
router.use('/product', verifyToken, productRoute);

module.exports = router;