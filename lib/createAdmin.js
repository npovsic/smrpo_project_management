const userModule = require('../api/users/methods');

module.exports = function () {
    userModule.doesAdminExist()
        .then(function (doesAdminExist) {
            if (!doesAdminExist) {
                console.log('Creating admin.');
                
                userModule.insert({
                    username: 'admin',
                    firstName: 'Administrator',
                    password: 'admin',
                    email: 'admin@admin',
                    role: 'admin'
                });
            }
        })
        .catch(function (err) {
            console.log('Could not create admin.', err);
        });
};