const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');
const sprintsModule = require('../api/sprints/methods');

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

        pageOptions.layoutOptions.headTitle = 'Pregled';
        pageOptions.layoutOptions.pageTitle = 'Pregled';

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
            const currentUserId = req.session.user._id;
            
            const projects = await projectModule.findAllForUser(currentUserId);
            //this has to be done on overview page
            const sprints = await sprintsModule.findActiveSprintsFromAllProjects(projects);
            
            pageOptions.projects = projects.map((project) => {
                project.roles = [];
                
                if (project.productLeader.equals(currentUserId)) {
                    project.roles.push('Produktni vodja');
                }
                
                if (project.scrumMaster.equals(currentUserId)) {
                    project.roles.push('Vodja metodologije');
                }
                
                if (project.developers.find((developerId) => developerId.equals(currentUserId))) {
                    project.roles.push('Razvijalec');
                }
                
                return project;
            });

            pageOptions.sprints = sprints;


            res.render('./dashboard/userDashboard', pageOptions);
        }
    }
};