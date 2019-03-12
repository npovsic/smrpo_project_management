const usersModule = require('../api/users/methods');

const hashSalt = require('password-hash-and-salt');

module.exports = function (username, password) {
    return new Promise(function (resolve, reject) {
        usersModule.findOne({ username: username })
            .then(function (foundUser) {
                hashSalt(password).verifyAgainst(foundUser.password, function (err, userVerified) {
                    if (err) {
                        console.log(err);

                        resolve(null);
                    }
                    
                    if (!userVerified) {
                        console.log('User was not verified, could not login.');
                        
                        resolve(null);
                    } else {
                        resolve(foundUser);
                    }
                });
                
            })
            .catch(function (err) {
                console.log(err);

                resolve(null);
            });
    });
};