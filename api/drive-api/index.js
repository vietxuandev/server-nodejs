const credentials = require('./credentials.json');
const token = require('./token.json');
const { google } = require('googleapis');
const stream = require('stream');

const authorize = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

module.exports.uploadFile = async (fileObject) => {
    try {
        const auth = authorize(credentials);
        const drive = google.drive({ version: 'v3', auth });
        const { originalname, mimetype } = fileObject;
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);
        const parents = mimetype.includes('image') ? [process.env.IMAGES_ID] : [process.env.FILES_ID];
        const fileMetadata = {
            name: originalname,
            parents
        };
        const media = {
            mimeType: mimetype,
            body: bufferStream
        };
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name, mimeType'
        })
        const file = response.data;
        return { src: `https://drive.google.com/uc?export=view&id=${file.id}`, name: file.name, type: file.mimeType };
    } catch (err) {
        return { error: { message: err.message } };
    }
}