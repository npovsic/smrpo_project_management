module.exports = function (req, res, next) {
    if (req.session.userRole === 'admin') {
        next();
    } else {
        res.render('unauthorized');
    }
};
