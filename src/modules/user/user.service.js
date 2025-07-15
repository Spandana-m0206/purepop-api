const BaseService = require('../base/BaseService');
const UserModel = require('./user.model');
class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }
    async findUsersByRole(role) {
        return await this.model.find({ role }) ;// intial it this.model.model convert to this.model
    }
    async findByEmail(email) {
        return await this.model.findOne({ email });
    }
    
}

module.exports = new UserService();