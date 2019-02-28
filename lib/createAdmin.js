const userModule = require('../api/users/methods');

module.exports = function () {
    userModule.doesAdminExist()
        .then(function (doesAdminExist) {
            if (!doesAdminExist) {
                console.log('Creating admin.');
                
                userModule.insert({
                    username: 'admin',
                    password: 'admin',
                    role: 'admin'
                });
            }
        })
        .catch(function (err) {
            
        });
};