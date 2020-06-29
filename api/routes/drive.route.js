const express = require('express');
const router = express.Router();
const controller = require('../controllers/drive.controller')
const { uploadFile } = require('../drive-api/index')
const upload = require('../middlewares/uploadMiddleware');

router.get('/', async (req, res) => {
    res.json(controller.generateAuthUrl())
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    controller.getToken(code);
    res.json('getToken');
});

router.post('/upload', (req, res) => {
    upload().single('file')(req, res, async (err) => {
        if (err) {
            return res.json({ error: { message: err.message } })
        }
        const fileObject = req.file;
        const data = await uploadFile(fileObject)
        return res.json(data)
    })
});

module.exports = router;