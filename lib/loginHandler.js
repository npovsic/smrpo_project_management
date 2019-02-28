const userModule = require('../api/users/methods');

module.exports = function (username, password) {
    return new Promise(function (resolve, reject) {
        userModule.findOne({ username: username })
            .then(function (foundUser) {
                if (password === foundUser.password) {
                    resolve(foundUser);
                } else {
                    resolve(null);
                }
            })
            .catch(function (err) {
                console.log(err);

                resolve(null);
            });
    });
};