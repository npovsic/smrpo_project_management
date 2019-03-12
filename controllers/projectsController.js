const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

const { check, validationResult } = require('express-validator/check');

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
            selected = projectRole.find((id) => {
                if (typeof id === 'string') {
                    return id === user._id.toString();
                } else {
                    return id.equals(user._id);
                }
            });
        } else {
            if (typeof projectRole === 'string') {
                selected = projectRole === user._id.toString();
            } else {
                selected = projectRole.equals(user._id);
            }
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

            pageOptions.layoutOptions.headTitle = 'Projekti';

            pageOptions.layoutOptions.navBar.breadcrumbs = [
                {
                    title: 'Projekti',
                    href: '/projects'
                }
            ];

            res.render('./projects/projectsListPage', pageOptions);
        } catch (ex) {
            console.log(ex);
        }
    },

    projectCreateGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        pageOptions.layoutOptions.headTitle = 'Nov projekt';

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

        const users = await usersModule.findAllUsers();

        pageOptions.usersSelectObjects = {
            productLeader: users.map(user => mapUserToSelectObject(user)),
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
            productLeader: postData.productLeader,
            scrumMaster: postData.scrumMaster,
            developers: postData.developers,
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

        projectModule.insert(projectData)
            .then(function (result) {
                res.redirect('/projects');
            })
            .catch(async function (err) {                
                const pageOptions = req.pageOptions;

                pageOptions.layoutOptions.headTitle = 'Nov projekt';

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

                const users = await usersModule.findAllUsers();

                pageOptions.usersSelectObjects = {
                    productLeader: users.map(user => mapUserToSelectObject(user, projectData.productLeader)),
                    scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
                    developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
                };

                pageOptions.projectData = projectData;

                console.log(err);
                
                if (err && err.errors) {
                    pageOptions.errors = {};

                    for (const property in err.errors) {
                        if (err.errors.hasOwnProperty(property)) {
                            const error = err.errors[property];

                            pageOptions.errors[property] = {
                                propertyName: error.path,
                                errorType: error.kind
                            };
                        }
                    }
                }
                
                res.render('./projects/projectEditPage', pageOptions);
            });
    },

    projectOverview: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        const projectId = req.params.projectId;

        const users = await usersModule.findAllUsers();

        const projectData = await projectModule.findOne({ _id: projectId });
        

        if (projectData.productLeader) {            
            projectData.productLeader = users.find((user) => user._id.equals(projectData.productLeader));
        }
        
        if (projectData.scrumMaster) {
            projectData.scrumMaster = users.find((user) => user._id.equals(projectData.scrumMaster));
        }
        
        if (projectData.developers) {
            projectData.developers = projectData.developers.map((developerId) => {
                return users.find((user) => user._id.equals(developerId));
            });
        }
        
        pageOptions.layoutOptions.headTitle = projectData.name;

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: projectData.name,
                href: `/projects/${projectId}`
            }
        ];

        const currentUser = pageOptions.currentUser;

        pageOptions.userCanAddUserStories = (projectData.productLeader || projectData.scrumMaster) ? (projectData.productLeader._id.equals(currentUser._id) || projectData.scrumMaster._id.equals(currentUser._id)) : false;
        pageOptions.userCanAddSprint = (projectData.scrumMaster) ? projectData.scrumMaster._id.equals(currentUser._id) : false;
        
        pageOptions.projectData = projectData;

        res.render('./projects/projectOverviewPage', pageOptions);
    },

    projectEditGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        const projectId = req.params.projectId;

        const users = await usersModule.findAllUsers();

        const projectData = await projectModule.findOne({ _id: projectId });

        const usersSelectObjects = {
            productLeader: users.map(user => mapUserToSelectObject(user, projectData.productLeader)),
            scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
            developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
        };

        pageOptions.layoutOptions.headTitle = `${projectData.name} - Uredi`;
        
        pageOptions.layoutOptions.pageTitle = 'Urejanje projekta';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: projectData.name,
                href: `/projects/${projectId}`
            },
            {
                title: 'Uredi',
                href: `/projects${projectId}/edit`
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
            productLeader: postData.productLeader,
            scrumMaster: postData.scrumMaster,
            developers: postData.developers,
            _lastUpdatedAt: new Date()
        };

        projectModule.update(projectId, projectData)
            .then(function (result) {
                res.redirect(`/projects/${projectId}`);
            })
            .catch(async function (err) {     
                const pageOptions = req.pageOptions;

                const users = await usersModule.findAllUsers();

                const usersSelectObjects = {
                    productLeader: users.map(user => mapUserToSelectObject(user, projectData.productLeader)),
                    scrumMaster: users.map(user => mapUserToSelectObject(user, projectData.scrumMaster)),
                    developers: users.map(user => mapUserToSelectObject(user, projectData.developers))
                };

                pageOptions.layoutOptions.headTitle = `${projectData.name} - Uredi`;

                pageOptions.layoutOptions.pageTitle = 'Urejanje projekta';

                pageOptions.layoutOptions.navBar.breadcrumbs = [
                    {
                        title: 'Projekti',
                        href: '/projects'
                    },
                    {
                        title: projectData.name,
                        href: `/projects/${projectId}`
                    },
                    {
                        title: 'Uredi',
                        href: `/projects${projectId}/edit`
                    }
                ];

                pageOptions.usersSelectObjects = usersSelectObjects;

                projectData._id = projectId;
                pageOptions.projectData = projectData;

                if (err && err.errors) {
                    pageOptions.errors = {};

                    for (const property in err.errors) {
                        if (err.errors.hasOwnProperty(property)) {
                            const error = err.errors[property];

                            pageOptions.errors[property] = {
                                propertyName: error.path,
                                errorType: error.kind
                            };
                        }
                    }
                }

                res.render('./projects/projectEditPage', pageOptions);
            });
    }
};