const usersModule = require('../api/users/methods');
const hashSalt = require('password-hash-and-salt');
const { body, validationResult } = require('express-validator/check');

const userRoles = require('../lib/userRoles');

const createUserRoleSelectObjects = function (userRole, selecteduserRole) {
    return {
        selected: userRole === selecteduserRole,
        name: userRoles.translations[userRole],
        value: userRole
    }
};

module.exports = {
    userCreateGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        pageOptions.layoutOptions.headTitle = 'Dodajanje uporabnikov';
        pageOptions.layoutOptions.pageTitle = 'Dodajanje novega uporabnika';

        pageOptions.userRolesSelectObjects = userRoles.values.map(createUserRoleSelectObjects);
        
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
            email: postData.email.toLowerCase(),
            username: postData.username,
            password: postData.password,
            role: (postData.role) ? postData.role.toLowerCase() : '',
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

        //create a hash password for the user
        hashSalt(postData.password).hash(function (err, hashedPassword) {
            if (err) {
                console.log(err);

                return;
            }
            
            const pageOptions = req.pageOptions;
            pageOptions.userData = userData;
            pageOptions.userRolesSelectObjects = userRoles.values.map((userRole) => {
                return createUserRoleSelectObjects(userRole, userData.role);
            });
            
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

            // Form validation using express-validate
            pageOptions.errors = {};
            
            const errorValidation = validationResult(req);
            
            if (!errorValidation.isEmpty()) {
                errorValidation.array().forEach(function (error) {
                    pageOptions.errors[error.param] = error.msg;
                });

                res.render('./users/usersEditPage', pageOptions);
            } else {
                userData.password = hashedPassword;
                usersModule.insert(userData)
                    .then(function (result) {
                        console.log(result);
                        res.redirect('/#users');
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.render('./users/usersEditPage', pageOptions);
                    });
            }
        });
    },

    userOverview: async function (req, res, next) {
        //parse the data from request 
        const userId = req.params.userId;
        const postData = req.body;

        //set the pageOptions
        const pageOptions = req.pageOptions;
        pageOptions.layoutOptions.headTitle = 'Pregled uporabnika';
        pageOptions.layoutOptions.pageTitle = 'Pregled uporabnika';
        
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Uporabniki',
                href: '/#users'
            },
            {
                title: 'Pregled uporabnika',
                href: '/users/' + userId
            }
        ];
        
        //find the user in DB
        const userData = await usersModule.findOne({ _id: userId });
        pageOptions.userData = userData;
        console.log(userData.role);
        console.log(createUserRoleSelectObjects(userData.role));
        pageOptions.userRole = createUserRoleSelectObjects(userData.role);

        res.render('./users/userOverviewPage', pageOptions);
    },

    validate(method) {
        switch (method) {
            case 'createUser': {
                return [
                    body('firstName').trim().isLength({
                        min: 1,
                        max: 64
                    }).not().isEmpty().withMessage('Ime ne sme biti prazno in mora biti krajše od 64 znakov.'),
                    
                    body('lastName').trim().isLength({
                        min: 0,
                        max: 64
                    }).withMessage('Priimek mora biti krajši od 64 znakov.'),
                    
                    body('email').exists().isEmail().withMessage('Naslov elektronske pošte ni pravilne oblike.'),
                    
                    body('email').custom(value => {
                        return usersModule.findOne({ 'email': value.toLowerCase() }).then(user => {
                            if (user) {
                                return Promise.reject('Naslov je že v uporabi. Prosimo, uporabite drugega.');
                            }
                        });
                    }),
                    
                    body('username').trim().isLength({
                        min: 1,
                        max: 64
                    }).not().isEmpty().withMessage('Uporabniško ime ne sme biti prazno in mora biti krajše od 64 znakov.'),
                    
                    body('username').custom(value => {
                        return usersModule.findAll().then(users => {
                            for(var i = 0; i < users.length; i++){
                                if(users[i].username.toLowerCase() === value.toLowerCase()) {
                                    return Promise.reject('Uporabniško ime je že v uporabi. Prosimo, izberite drugega.');  
                                }
                            }
                        })
                    }),
                    
                    body('password').isLength({
                        min: 4,
                        max: 64
                    }).withMessage('Geslo mora imeti od 4 do 64 znakov.'),
                    
                    body('role').isIn(userRoles.values).withMessage('Sistemska pravica mora biti ena od ponujenih.')
                ];
            }
        }
    }
};
