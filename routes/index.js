const express = require('express');
const router = express.Router();

const authenticateAdmin = require('../middlewares/authenticateAdmin');

const loginHandler = require('../lib/loginHandler');

router.get('/', authenticateAdmin, function (req, res, next) {
    res.render('./admin/dashboard/dashboard', { title: 'Express' });
});


router.get('/login', function (req, res, next) {
    res.render('./login/login');
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;

    const foundUser = await loginHandler(username, password);

    console.log({ foundUser });

    if (foundUser) {
        req.session.user = foundUser;
        req.session.userRole = foundUser.role;
        
        res.render('loginSuccessful');
    } else {
        console.log('Login not successful.');
    }
});

router.get('/logout', async function (req, res, next) {
    req.session.user = null;
    req.session.userRole = null;
});

module.exports = router;