module.exports = function (req, res, next) {
    if (req.session.userRole === 'system_user') {
        res.render('unauthorized');
    }
};
