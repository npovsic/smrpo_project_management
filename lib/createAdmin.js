const usersModule = require('../api/users/methods');

const hashSalt = require('password-hash-and-salt');

const adminUser = {
    username: 'admin',
    firstName: 'Administrator',
    password: 'admin',
    email: 'admin@admin',
    role: 'system_admin'
};

module.exports = function () {
    usersModule.doesAdminExist()
        .then(function (doesAdminExist) {
            if (!doesAdminExist) {
                console.log('Creating admin.');
                
                hashSalt(adminUser.password).hash(function (err, hashedPassword) {
                   if (err) {
                       console.log(err);
                       
                       return;
                   }

                    adminUser.password = hashedPassword;

                    usersModule.insert(adminUser);

                    console.log('Admin created.');
                });
            }
        })
        .catch(function (err) {
            console.log('Could not create admin.', err);
        });
};