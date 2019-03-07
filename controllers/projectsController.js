const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

const mapUserToSelectObject = function (user, projectRole) {
    let name = '';

    if (user.firstName) {
        name = user.firstName;

        if (user.lastName) {
            name = `${name} ${user.lastName}`;
        }

        name = `${name} (${user.username})`;
    } else {
        name = user.username;
    }

    let selected = false;

    if (projectRole) {
        if (Array.isArray(projectRole)) {
            selected = projectRole.find((developerId) => developerId.equals(user._id));
        } else {
            selected = projectRole.equals(user._id);
        }
    }

    return {
        selected,
        value: user._id,
        title: name
    }
};

module.exports = {
    projectsList: async function (req, res, next) {
        try {
            const pageOptions = req.pageOptions;

            pageOptions.projects = await projectModule.findAll();

            pageOptions.layoutOptions.pageTitle = 'Projekti';

            pageOptions.layoutOptions.navBar.breadcrumbs = [
                {
                    title: 'Projekti',
                    href: '/projects'
                }
            ];

            res.render('./projects/projectsPage', pageOptions);
        } catch (ex) {
            console.log(ex);
        }
    },

    projectCreateGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        pageOptions.layoutOptions.pageTitle = 'Nov projekt';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: 'Nov projekt',
                href: '/projects/create'
            }
        ];

        const users = await usersModule.findAll();

        pageOptions.usersSelectObjects = {
            projectLeader: users.map(user => mapUserToSelectObject(user)),
            scrumMaster: users.map(user => mapUserToSelectObject(user)),
            developers: users.map(user => mapUserToSelectObject(user))
        };

        res.render('./projects/projectEditPage', pageOptions);
    },

    projectCreatePost: async function (req, res, next) {
        const postData = req.body;

        const projectData = {
            name: postData.name,
            description: postData.description,
            projectLeader: postData.projectLeader,
            scrumMaster: postData.scrumMaster,
            developers: postData.developers,
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

        console.log(projectData);

        projectModule.insert(projectData)
            .then(function (result) {
                res.redirect('/projects');
            })
            .catch(async function (err) {
                console.log(err);

                const pageOptions = req.pageOptions;

                pageOptions.layoutOptions.pageTitle = 'Nov projekt';

                pageOptions.layoutOptions.navBar.breadcrumbs = [
                    {
                        title: 'Projekti',
                        href: '/projects'
                    },
                    {
                        title: 'Nov projekt',
                        href: '/projects/create'
                    }
                ];

                const users = await usersModule.findAll();

                pageOptions.usersSelectObjects = {
                    projectLeader: users.map(user => mapUserToSelectObject(user, projectData.projectLeader)),
                    scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
                    developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
                };

                pageOptions.error = {
                    message: 'Napaka pri ustvarjanju novega projekta'
                };

                res.redirect('/projects/create');
            });
    },

    projectEditGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        const projectId = req.params.projectId;

        const users = await usersModule.findAll();

        const projectData = await projectModule.findOne({ _id: projectId });

        const usersSelectObjects = {
            projectLeader: users.map(user => mapUserToSelectObject(user, projectData.projectLeader)),
            scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
            developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
        };

        pageOptions.layoutOptions.pageTitle = 'Uredi projekt';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: 'Uredi projekt',
                href: `/projects${projectId}`
            }
        ];

        pageOptions.usersSelectObjects = usersSelectObjects;
        pageOptions.projectData = projectData;

        res.render('./projects/projectEditPage', pageOptions);
    },

    projectEditPost: async function (req, res, next) {
        const projectId = req.params.projectId;

        const postData = req.body;

        const projectData = {
            name: postData.name,
            description: postData.description,
            projectLeader: postData.projectLeader,
            scrumMaster: postData.scrumMaster,
            developers: postData.developers,
            _lastUpdatedAt: new Date()
        };

        projectModule.update(projectId, projectData)
            .then(function (result) {
                res.redirect('/projects');
            })
            .catch(async function (err) {
                console.log(err);

                const pageOptions = req.pageOptions;

                const users = await usersModule.findAll();

                const usersSelectObjects = {
                    projectLeader: users.map(user => mapUserToSelectObject(user, projectData.projectLeader)),
                    scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
                    developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
                };

                pageOptions.layoutOptions.pageTitle = 'Uredi projekt';

                pageOptions.layoutOptions.navBar.breadcrumbs = [
                    {
                        title: 'Projekti',
                        href: '/projects'
                    },
                    {
                        title: 'Uredi projekt',
                        href: `/projects${projectId}`
                    }
                ];

                pageOptions.usersSelectObjects = usersSelectObjects;
                pageOptions.projectData = projectData;

                res.render('./projects/projectEditPage', pageOptions);
            });
    }
};