module.exports = function (req, res, next) {
    if (req.session.userRole === 'system_admin') {
        next();
    } else {
        res.render('unauthorized');
    }
};
