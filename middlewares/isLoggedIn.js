module.exports = function (req, res, next) {
    if (req.session.activeUser) {
        next();
    } else {
        res.redirect('/login');
    }
};