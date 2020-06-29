const multer = require('multer');

const upload = (size = 4 * 1024 * 1024) => multer({
    limits: {
        fileSize: size
    }
});

module.exports = upload