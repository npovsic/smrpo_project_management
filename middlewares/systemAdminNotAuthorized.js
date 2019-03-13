module.exports = function (req, res, next) {
    if (req.session.userRole === 'system_admin') {
        res.render('unauthorized');
    } else {
        next();
    }
};
