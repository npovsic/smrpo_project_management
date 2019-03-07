const userSideMenuItems = [
    {
        href: '/',
        title: 'Pregled'
    },
    {
        href: '/projects',
        title: 'Projekti'
    }
];

const selectActiveRoute = function (right, requestUrl) {
    const rootRoute = requestUrl.split('/')[1];

    return {
        href: right.href,
        title: right.title,
        active: right.href === `/${rootRoute}`
    };
};

module.exports = function (req, res, next) {
    const isCurrentUserSystemAdmin = (req.session.userRole === 'admin');

    const pageOptions = {
        layoutOptions: {
            pageTitle: '',
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

    // if (!pageOptions.isUserSystemAdmin) {
    //     pageOptions.layoutOptions.sideMenu.items = userSideMenuItems.map(right => selectActiveRoute(right, req.originalUrl));
    // }

    req.pageOptions = pageOptions;

    next();
};
