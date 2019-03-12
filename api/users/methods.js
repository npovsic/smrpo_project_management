const User = require('./model/User');

/**
 * These methods are used as middleware
 */
module.exports = {
    findAll: async function ()  {
        const users = await User.find({}).exec();
        
        return users;
    },
    
    findAllUsers: async function ()  {
        const users = await User.find({ role: { $ne: 'system_admin' } }).exec();
        
        return users;
    },
    
    findOne: async function () {
        const user = await User.findOne(...arguments).exec();
        
        return user;
    },
    
    insert: async function (userData) {
        const user = new User(userData);

        return await user.save();
    },
    
    update: async function (userData) {
        const userInDatabase = await User.findOne({ _id: userData._id }).exec();
    },
    
    doesAdminExist: async function () {
        const admin = await User.findOne({ role: 'system_admin' }).exec();
        
        return admin; 
    }
};