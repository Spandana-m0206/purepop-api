const BaseController = require('../base/BaseController');
const FileService = require('./file.service');

class FileController extends BaseController {
    constructor() {
        super(FileService, 'File');
    }

    async uploadFile(req, res, next) {
        try {
            const fileData = {
                filename: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.user.userId,
                url: `${process.env.BASE_URL}/files/link/${req.file.id}`,
            };

            const newFile = await this.service.create(fileData);
            res.status(201).json({ success: true, data: newFile });
        } catch (error) {
            next(error);
        }
    }

    async getDownloadFile  (req, res, next)  {
        try {
            await FileService.getFileStream(res, req.params.fileId);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new FileController();