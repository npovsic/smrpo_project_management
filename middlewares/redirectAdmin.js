module.exports = function (req, res, next) {
    if (req.session.userRole === 'system_admin') {
        res.redirect('/');
    } else {
        next();
    }
};