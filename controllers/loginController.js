const loginHandler = require('../lib/loginHandler');

module.exports = {
    loginGet(req, res, next) {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('./login/login');
        }
    },

    loginPost: async function (req, res, next) {
        const { username, password } = req.body;

        const foundUser = await loginHandler(username, password);

        if (foundUser) {
            foundUser.password = '';
            
            req.session.user = foundUser;
            req.session.userRole = foundUser.role;

            let redirectUrl = '/';

            if (req.session.redirectUrl) {
                redirectUrl = req.session.redirectUrl;

                req.session.redirectUrl = null;
            }

            res.redirect(redirectUrl);
        } else {
            res.render('./login/loginFailed');
        }
    },
    
    logoutGet(req, res, next) {
        req.session.user = null;
        req.session.userRole = null;

        res.redirect('/');
    }
};