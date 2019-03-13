const mongoose = require('mongoose');

const userModule = require('../api/users/methods');

/**
 * Takes a string and converts it into an ObjectId that can then be passed
 * around in queries.
 */
module.exports = function (id) {
    return mongoose.Types.ObjectId(id);
};