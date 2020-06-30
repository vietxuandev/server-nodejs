const fs = require('fs');
const credentials = require('../configs/credentials.json');
const { google } = require('googleapis');
const TOKEN_PATH = './api/configs/token.json';
const token = require('../configs/token.json');
const stream = require('stream');

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const SCOPES = ['https://www.googleapis.com/auth/drive'];


const authorize = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

module.exports.generateAuthUrl = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    return authUrl;
}

module.exports.getToken = (code) => {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
    });
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