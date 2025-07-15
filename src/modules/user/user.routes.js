const express = require('express');
const UserController = require('./user.controller');
const upload = require('../file/file.storage');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const{ isAdmin }= require('../../middlewares/isadmin');
const router = express.Router();

router.post(
    '/profile-photo/:id',
    upload.single('file'),
    authMiddleware, UserController.uploadProfilePhoto.bind(UserController),
); // Upload profile photo
//TODO: admin
router.post('/', UserController.create.bind(UserController)); // Create user
router.get('/',authMiddleware, isAdmin, UserController.findPaginated.bind(UserController)); // Get all users
router.get('/:id',authMiddleware,  UserController.findOne.bind(UserController)); // Get user by ID
router.put('/:id', authMiddleware,UserController.update.bind(UserController)); // Update user
router.delete('/:id',authMiddleware, UserController.delete.bind(UserController)); // Delete user

router.get('/role/:role', authMiddleware,isAdmin, UserController.getUsersByRole.bind(UserController)); // Find users by role

module.exports = router;