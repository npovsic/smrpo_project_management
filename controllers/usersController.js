const userModule = require('../api/users/methods');
const hashSalt = require('password-hash-and-salt');
const userRoles = [ 'Admin', 'Razvijalec' ];

module.exports = {
    usersList: async function (req, res, next) {
        try {
            const pageOptions = req.pageOptions;

            pageOptions.users = await userModule.findAll();

            pageOptions.layoutOptions.headTitle = 'Uporabniki';

            pageOptions.layoutOptions.navBar.breadcrumbs = [
                {
                    title: 'Uporabniki',
                    href: '/users'
                }
            ];

            res.render('./users/usersPage', pageOptions);
        } catch (ex) {
            console.log(ex);
        }
    },

    userCreateGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        pageOptions.layoutOptions.headTitle = 'Dodajanje uporabnikov';
        pageOptions.layoutOptions.pageTitle = 'Dodajanje novega uporabnika';

        pageOptions.userRoles = userRoles;
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Uporabniki',
                href: '/users'
            },
            {
                title: 'Nov uporabnik',
                href: '/users/create'
            }
        ];

        res.render('./users/usersEditPage', pageOptions);
    },


    userCreatePost: async function (req, res, next) {
        const postData = req.body;
    
        const userData = {
            firstName: postData.firstName,
            lastName: postData.lastName,
            email: postData.email,
            username: postData.username,
            password: postData.password,
            role: postData.role.toLowerCase(),
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

        //create a hash password for the user
        hashSalt(userData.password).hash(function (err, hashedPassword) {
            if (err) {
               console.log(err);
               
               return;
            }

            userData.password = hashedPassword;
        });

        const pageOptions = req.pageOptions;
        pageOptions.userData = userData;

       
        userModule.insert(userData)
            .then(function (result) {
                console.log(result);
                res.redirect('/users');
            })
            .catch(function (err) {
                console.log(err);
                res.redirect('/users/create');
            }); 
    },
};
