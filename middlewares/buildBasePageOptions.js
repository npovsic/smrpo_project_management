module.exports = function (req, res, next) {
    const isCurrentUserSystemAdmin = (req.session.userRole === 'system_admin');

    const pageOptions = {
        layoutOptions: {
            headTitle: '',
            navBar: {
                show: true,
                breadcrumbs: null,
                buttons: null
            },
            sideMenu: {
                show: false,
                items: null
            }
        },
        currentUser: req.session.user,
        currentUserRole: req.session.userRole
    };

    pageOptions.isUserSystemAdmin = isCurrentUserSystemAdmin;
    
    req.pageOptions = pageOptions;

    next();
};
