module.exports = function (req, res, next) {
    if (req.session.userRole === 'admin') {
        res.redirect('/');
    } else {
        next();
    }
};