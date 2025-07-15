const BaseService = require('../base/BaseService');
const File = require('./file.model');
const { getGFSBucket } = require('../../config/database');
const { default: mongoose } = require('mongoose');
const mime = require('mime-types');

class FileService extends BaseService {
    constructor() {
        super(File);
    }

    async getFileDownloadStream (fileId) {
        return new Promise(async (resolve, reject) => {
            try {
                const gfs = getGFSBucket();
                const objectId = new mongoose.Types.ObjectId(fileId);

                const files = await gfs.find({ _id: objectId }).toArray();
                
                if (files.length === 0) {
                    return reject(new Error('File not found'));
                }
    
                const metadata = files[0];

                const readStream = gfs.openDownloadStream(objectId);

                readStream.on('error', (err) => {
                    reject(new Error('Error reading file stream: ' + err.message));
                });

                resolve({
                    fileStream: readStream,
                    metadata: {
                        filename: metadata.filename,
                        contentType: metadata.contentType,
                        length: metadata.length,
                        uploadDate: metadata.uploadDate,
                        metadata: metadata.metadata
                    }
                });
            } catch (error) {
                reject(new Error('Error retrieving file: ' + error.message));
            }
        });
    };

    async getFileStream (res, fileId) {
    try {

        const bucket = getGFSBucket();

        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type',mime.lookup(file[0].filename) || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${file[0].filename}"`);

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        downloadStream.pipe(res);

        downloadStream.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).send('Failed to stream the file');
        });

        downloadStream.on('end', () => {
            res.end();
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving file');
    }};
    
    async getFileByName(filename){
        try {
            const gfs = getGFSBucket();
            const readstream = gfs.openDownloadStreamByName(filename);

            return new Promise((resolve, reject) => {
                readstream.on('error', (err) => {
                    reject(new Error('File not found'));
                });
    
                // Resolve the readstream
                resolve(readstream);
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };
}

module.exports = new FileService();