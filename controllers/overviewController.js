const rootRoute = '/';

module.exports = {
    overviewGet(req, res, next) {
        const pageOptions = {
            layoutOptions: {
                pageTitle: 'Pregled',
                navBar: {
                    show: true,
                    breadcrumbs: [
                        {
                            title: 'Pregled',
                            href: '/'
                        }
                    ],
                    buttons: [
                        {
                            label: 'Odjava',
                            href: '/logout'
                        }
                    ]
                },
                sideMenu: {
                    show: true
                }
            },
            currentUser: req.session.user,
            currentUserRole: req.session.userRole
        };

        pageOptions.isAdmin = (pageOptions.currentUserRole === 'admin');

        pageOptions.layoutOptions.sideMenu.items = require('../lib/createSideMenuItems')(rootRoute, pageOptions);

        res.render('./dashboard/dashboard', pageOptions);
    }
};