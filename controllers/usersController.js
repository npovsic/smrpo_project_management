const userModule = require('../api/users/methods');
const hashSalt = require('password-hash-and-salt');
const { body, validationResult } = require('express-validator/check');
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
            const pageOptions = req.pageOptions;
            pageOptions.userData = userData;
            pageOptions.userRoles = userRoles;
            pageOptions.layoutOptions.headTitle = 'Dodajanje uporabnikov';
            pageOptions.layoutOptions.pageTitle = 'Dodajanje novega uporabnika';
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

            //form validation using express-validate
            pageOptions.errors = {};
            var errorValidation = validationResult(req);
            if(!errorValidation.isEmpty()){
                errorValidation.array().forEach(function(ele){
                    pageOptions.errors[ele.param] = ele.msg;
                });

                res.render('./users/usersEditPage', pageOptions);
            } else {
                userData.password = hashedPassword;
                userModule.insert(userData)
                    .then(function (result) {
                        console.log(result);
                        res.redirect('/users');
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.render('./users/usersEditPage', pageOptions);
                    }); 
            }
        });
    },

    validate: function (method) {
        switch (method) {
            case 'createUser': {
                return [ 
                    body('firstName').trim().isLength({ min: 1, max: 64 }).not().isEmpty().withMessage('Ime ne sme biti prazno in mora biti manjše od 64 znakov'),
                    body('lastName').trim().isLength({ min: 0, max: 64 }).withMessage('Priimek je lahko prazen oziroma mora vsebovati manj kot 64 znakov'),
                    body('email').exists().isEmail().withMessage('Email naslov ni regularen, uporabite drug email naslov'),
                    body('email').custom(value => {
                        return userModule.findOne({ 'email': value }).then(user => {
                            if (user) {
                              return Promise.reject('Email naslov je že v uporabi, prosimo uporabite drugega');
                            }
                        });
                    }),
                    body('username').trim().isLength({ min: 1, max: 64 }).not().isEmpty().withMessage('Uporabniško ne sme biti prazno in mora biti manjše od 64 znakov'),
                    body('username').custom(value => {
                        return userModule.findOne({ 'username': value }).then(user => {
                            console.log(value);
                            console.log(user);
                            if(user) {
                                return Promise.reject('Uporabniško ime je že v uporabi, prosimo izberite drugega');
                            }
                        })
                    }),
                    body('password').isLength({ min: 4, max: 64 }).withMessage('Geslo mora vsebovati med 4 in 64 znaki'),
                    body('role').isIn(userRoles).withMessage('Sistemska pravica se ne ujema z možnimi izbirami')
               ];  
            }
        }
    }
};