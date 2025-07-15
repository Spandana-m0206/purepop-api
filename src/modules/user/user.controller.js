const BaseController = require('../base/BaseController');
const UserService = require('./user.service');
const ApiError = require('../../utils/apiError');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../utils/apiResponse');
const {enumToArray} = require('../../utils/enumtoarray');
const { Roles } = require('../../utils/enums');

class UserController extends BaseController{

    constructor(){
        super( UserService, "User");
    }

    async findOne(req, res, next) {
        try {
            const user = await this.service.findById(req.params.id);
            if (!user|| !user.isActive) {
                return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND, "User not found"));
            }
            const user_role = req.user.role;
            const user_id = req.user._id;
            if (user_role === Roles.ADMIN || user_id === req.params.id) {
                const data = user.toJSON();
                return (new ApiResponse(StatusCodes.ACCEPTED, data, "User fetched successfully", res))
            }
            return res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
        } catch (error) {
            next(error);
        }
    }

    async getUsersByRole(req, res, next) {
        try {
            const users = await this.service.findUsersByRole(req.params.role);
            if (!users) {
                return next(new ApiError(StatusCodes.NOT_FOUND, 'No users found with this role'));
            }
            const data = users.toJSON();
            return new ApiResponse( StatusCodes.OK,data, 'Users retrieved successfully', res);
        } catch (error) {
            next(error);
        }
    } 
    
    async uploadProfilePhoto(req, res, next) {
        try {
            const user = req.user;
            if (req.file) {
                const attachment = await fileService.create({
                    filename: req.file.originalname,
                    type: req.file.mimetype,
                    size: req.file.size,
                    org: req.user.org,
                    uploadedBy: req.user.userId,
                    url: `${process.env.BASE_URL}/api/v1/files/link/${req.file.id}`,
                })
                user.profilePhoto = attachment._id
            }
            await user.save();
            return new ApiResponse(StatusCodes.OK,user, 'Profile photo uploaded successfully', res);
        } catch (error) {
            next(error);
        }
    } 
    async create(req, res) {
        try {
            const { name, phone, countryCode, email, role, password } = req.body;
            if (!name || !phone || !email || !password || !role || !countryCode) {
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please fill the reqired feild"));
            }
            if (!role || !enumToArray(Roles).includes(role)) {
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please provide the valid role"));
            }

            // not existed
            // const isUserExisted = await this.service.findOne({
            //     $or: [
            //         { email },
            //         { phone }
            //     ]
            // })
            // if (isUserExisted) {
            //     return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "User with same Email or Phone already exists"));
            // }
            const newUser = await UserService.create({ name, phone, countryCode, email: email.trim().toLowerCase(), role, password });

            return res.status(StatusCodes.CREATED).json(new ApiResponse( StatusCodes.CREATED,  {
                user_id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            },"User succesfully created"))
        } catch (error) {
            next(error);

        }
    } 
    async update(req, res) {
        try {
            const { countryCode, email, role } = req.body;
            if ((countryCode && (!countryCode.trim() || !countryCodeRegex.test(countryCode)))) {
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, " Please provide the valid details"));
            }

            if (email) {
                if (!email.trim()) {
                    return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please provide a valid email"));
                }
                else {
                    const isUserExisted = await UserService.findOne({
                        email: email.trim().toLowerCase()
                    })
                    if (isUserExisted && isUserExisted._id != req.body._id) {
                        return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please provide a valid email"));
                    }
                }
            }
            const isUserExisted = await UserService.findOne({ _id: req.params.id })
            if (!isUserExisted || !isUserExisted.isActive) {
                return res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.BAD_REQUEST, "User does not exist"));
            }
            const user_role = req.user.role;
            const user_id = req.user._id;
            if (role && user_role !== Roles.ADMIN ) {
                return res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, "You are not allowed to change the role"));
            }
            if (user_role === Roles.ADMIN || user_id === req.params.id) {
                const updatedUser = await UserService.update({ _id: req.params.id }, req.body);
                return (
                    new ApiResponse(res, StatusCodes.OK, "User updated successfully", {
                        userId: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                        phone: updatedUser.phone,
                    })
                );
            }
            return res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
        } catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const user_role = req.user.role;
            const user_id = req.user._id;
            const user = await this.service.findById(req.params.id);
            if (!user || !user.isActive) {
                return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND, "User not found"));
            }
            if (user_role === Roles.ADMIN || user_id === req.params.id) {
                user.isActive = false;
                await this.service.update({ _id: req.params.id }, { $set: { isActive: false } });
                return (new ApiResponse(res, StatusCodes.ACCEPTED, "User deleted successfully", null));
            }
            return res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN, "Access denied"));
        } catch (error) {
            next(error);
        }
    } 
    
}

module.exports = new UserController();