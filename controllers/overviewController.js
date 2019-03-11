const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

const getUserFromSession = require('../lib/getUserFromSession');

module.exports = {
    overviewGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;
        
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Pregled',
                href: '/'
            }
        ];

        if (pageOptions.isUserSystemAdmin) {
            pageOptions.layoutOptions.navBar.tabs = [
                {
                    label: 'Projekti',
                    href: '#projects'
                },
                {
                    label: 'Uporabniki',
                    href: '#users'
                }
            ];
            
            pageOptions.projects = await projectModule.findAll();
            pageOptions.users = await usersModule.findAll();

            res.render('./dashboard/adminDashboard', pageOptions);
        } else {
            pageOptions.projects = await projectModule.findAllForUser(
                await getUserFromSession(req.session)
            );

            res.render('./dashboard/userDashboard', pageOptions);
        }
    }
};