const express = require('express');
const FileController = require('./file.controller');
const upload = require('./file.storage');
const {authMiddleware}=require('../../middlewares/auth.middleware')
const router = express.Router();

router.post('/', upload.single('file'), FileController.uploadFile.bind(FileController));

router.use(authMiddleware)
router.get('/', FileController.find.bind(FileController));
router.get('/:id', FileController.findOne.bind(FileController));
router.delete('/:id', FileController.delete.bind(FileController));

router.get('/link/:fileId', FileController.getDownloadFile.bind(FileController));

module.exports = router;