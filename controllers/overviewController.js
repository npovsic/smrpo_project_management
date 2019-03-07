const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

module.exports = {
    overviewGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;
        
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Pregled',
                href: '/'
            }
        ];

        if (pageOptions.isSystemAdmin) {
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

            res.render('./dashboard/adminDashboard', pageOptions);
        } else {
            res.render('./dashboard/userDashboard', pageOptions);
        }
    }
};