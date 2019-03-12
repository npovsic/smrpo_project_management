module.exports = function (req, res, next) {
    if (req.session.userRole === 'system_admin') {
        const pageOptions = {
            layoutOptions: {
                headTitle: 'Nimate pravic za ogled strani',
                backgroundClass: 'background',
                navBar: {
                    show: false,
                    breadcrumbs: null,
                    buttons: null
                },
                sideMenu: {
                    show: false,
                    items: null
                }
            }
        };

        res.render('unauthorized', pageOptions);
    } else {
        next();
    }
};