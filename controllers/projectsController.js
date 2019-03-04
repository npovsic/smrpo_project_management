const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

const rootRoute = '/projects';

module.exports = {
    projectsList: async function (req, res, next) {
        try {
            const projects = await projectModule.findAll();

            const pageOptions = {
                projects,
                layoutOptions: {
                    pageTitle: 'Pregled',
                    navBar: {
                        show: true,
                        breadcrumbs: [
                            {
                                title: 'Projekti',
                                href: '/projects'
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

            res.render('./projects/projectsPage', pageOptions);
        } catch (ex) {
            console.log(ex);
        }
    },

    projectCreateGet: async function (req, res, next) {
        const users = await usersModule.findAll();

        const usersSelectObjects = {
            projectLeader: users.map((user) => {
                return {
                    value: user._id,
                    title: user.username
                }
            }),
            scrumMaster: users.map((user) => {
                return {
                    value: user._id,
                    title: user.username
                }
            }),
            developers: users.map((user) => {
                return {
                    value: user._id,
                    title: user.username
                }
            })
        };


        const pageOptions = {
            usersSelectObjects,
            layoutOptions: {
                pageTitle: 'Nov projekt',
                navBar: {
                    show: true,
                    breadcrumbs: [
                        {
                            title: 'Projekti',
                            href: '/projects'
                        },
                        {
                            title: 'Nov projekt',
                            href: '/projects/create'
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

        res.render('./projects/projectEditPage', pageOptions);
    },

    projectCreatePost(req, res, next) {
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
            .catch(function (err) {
                console.log(err);

                res.redirect('/projects/create');
            });
    },

    projectEditGet: async function (req, res, next) {
        const projectId = req.params.projectId;

        const users = await usersModule.findAll();

        const projectData = await projectModule.findOne({ _id: projectId });

        const usersSelectObjects = {
            projectLeader: users.map((user) => {
                const isUserProjectLeader = projectData.projectLeader && projectData.projectLeader.equals(user._id);

                return {
                    value: user._id,
                    title: user.username,
                    selected: isUserProjectLeader
                }
            }),
            scrumMaster: users.map((user) => {
                const isUserScrumMaster = projectData.scrumMaster && projectData.scrumMaster.equals(user._id);

                return {
                    value: user._id,
                    title: user.username,
                    selected: isUserScrumMaster
                }
            }),
            developers: users.map((user) => {
                const isUserADeveloper = projectData.developers && projectData.developers.find((developerId) => developerId.equals(user._id));

                return {
                    value: user._id,
                    title: user.username,
                    selected: isUserADeveloper
                }
            })
        };

        const pageOptions = {
            usersSelectObjects,
            projectData,
            layoutOptions: {
                pageTitle: 'Uredi projekt',
                navBar: {
                    show: true,
                    breadcrumbs: [
                        {
                            title: 'Projekti',
                            href: '/projects'
                        },
                        {
                            title: 'Uredi projekt',
                            href: `/projects${projectId}`
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
            .catch(function (err) {
                console.log(err);

                res.redirect(`/projects/${projectId}`);
            });
    }
};