module.exports = function (req, res, next) {
    if (req.originalUrl === '/login' || req.session.user) {
        next();
    } else {
        req.session.redirectUrl = req.originalUrl;
        
        res.redirect('/login');
    }
};