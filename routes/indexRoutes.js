const express = require('express');
const router = express.Router();

const authenticateAdmin = require('../middlewares/authenticateAdmin');

const loginHandler = require('../lib/loginHandler');

router.get('/', function (req, res, next) {
    if (req.session.userRole === 'admin') {
        const pageOptions = {
            layoutOptions: {
                pageTitle: 'Pregled',
                navBar: {
                    show: true,
                    breadcrumbs: [
                        {
                            title: 'Pregled',
                            href: '/'
                        }
                    ],
                    buttons: [
                        {
                            label: 'Odjava',
                            href: '/logout'
                        }
                    ]
                },
                sideMenu: {
                    show: true,
                    items: [
                        {
                            title: 'Pregled',
                            href: '/',
                            active: true
                        },
                        {
                            title: 'Projekti',
                            href: '/projects'
                        }
                    ]
                }
            },
            isAdmin: true
        };
        
        res.render('./admin/dashboard/dashboard', pageOptions);
    } else {
        res.render('./user/dashboard/dashboard', { title: 'Express' });
    }
});

router.get('/login', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('./login/login');
    }
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;

    const foundUser = await loginHandler(username, password);

    if (foundUser) {
        req.session.user = foundUser;
        req.session.userRole = foundUser.role;
        
        let redirectUrl = '/';
        
        if (req.session.redirectUrl) {
            redirectUrl = req.session.redirectUrl;

            req.session.redirectUrl = null;
        }

        res.redirect(redirectUrl);
    } else {
        res.render('loginFailed');
    }
});

router.get('/logout', async function (req, res, next) {
    req.session.user = null;
    req.session.userRole = null;
    
    res.redirect('/');
});

module.exports = router;