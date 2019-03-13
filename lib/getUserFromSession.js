const idFromString = require('./idFromString');

const userModule = require('../api/users/methods');

/**
 * Takes a session (normally req.session in a controller) and returns the
 * currently logged in user - its _id can then be passed around in queries.
 */
module.exports = async function (session) {
    return await userModule.findOne({_id: idFromString(session.user._id)});
};