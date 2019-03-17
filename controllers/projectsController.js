const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');
const storyModule = require('../api/stories/methods');
const sprintModule = require('../api/sprints/methods');

const { body, validationResult } = require('express-validator/check');

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

        // Form validation using express-validate
        pageOptions.errors = {};

        const errorValidation = validationResult(req);

        if (!errorValidation.isEmpty()) {
            errorValidation.array().forEach(function (error) {
                pageOptions.errors[error.param] = error.msg;
            });

            res.render('./projects/projectEditPage', pageOptions);
        } else {
            projectModule.insert(projectData)
                .then(function (result) {
                    res.redirect('/projects');
                })
                .catch(async function (err) {
                    console.log(err);

                    res.render('./projects/projectEditPage', pageOptions);
                });
        }
    },

    projectOverview: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        const projectId = req.params.projectId;

        const users = await usersModule.findAllUsers();

        const projectData = await projectModule.findOne({ _id: projectId });

        const activeSprint = await sprintModule.findActiveSprintFromProject(projectId);
        const inactiveSprints = await sprintModule.findNotActiveSprintsFromProject(projectId);

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

        pageOptions.userCanEditProject = pageOptions.isUserSystemAdmin;
        pageOptions.userCanAddUserStories = (projectData.productLeader || projectData.scrumMaster) ? (projectData.productLeader._id.equals(currentUser._id) || projectData.scrumMaster._id.equals(currentUser._id)) : false;
        pageOptions.userCanAddSprint = (projectData.scrumMaster) ? projectData.scrumMaster._id.equals(currentUser._id) : false;

        pageOptions.projectData = projectData;
        pageOptions.activeSprint = activeSprint;
        pageOptions.inactiveSprints = inactiveSprints;

        pageOptions.productBacklog = {
            storiesInActiveSprint: await storyModule.find({
                project: projectData._id,
                sprint: { $ne: null },
                finished: false
            }),
            storiesWithoutSprint: await storyModule.find({
                project: projectData._id,
                sprint: null,
                finished: false
            }),
            storiesFinished: await storyModule.find({
                project: projectData._id,
                finished: true
            })
        };

        pageOptions.hasStories =
            pageOptions.productBacklog.storiesInActiveSprint.length ||
            pageOptions.productBacklog.storiesWithoutSprint.length ||
            pageOptions.productBacklog.storiesFinished.length;

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
                href: `/projects/${projectId}/edit`
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

        // Form validation using express-validate
        pageOptions.errors = {};

        const errorValidation = validationResult(req);

        if (!errorValidation.isEmpty()) {
            errorValidation.array().forEach(function (error) {
                pageOptions.errors[error.param] = error.msg;
            });

            res.render('./projects/projectEditPage', pageOptions);
        } else {
            projectModule.update(projectId, projectData)
                .then(function (result) {
                    res.redirect(`/projects/${projectId}`);
                })
                .catch(async function (err) {
                    console.log(err);

                    res.render('./projects/projectEditPage', pageOptions);
                });
        }
    },
    
    validate(method) {
        switch (method) {
            case 'createProject': {
                return [
                    body('name').trim().isLength({
                        min: 1,
                        max: 64
                    }).not().isEmpty().withMessage('Ime projekta ne sme biti prazno in mora biti manjše od 64 znakov'),
                    body('productLeader').not().isEmpty().withMessage('Nastavite produktnega vodjo'),
                    body('scrumMaster').not().isEmpty().withMessage('Nastavite vodjo metodologije'),
                    body('developers').not().isEmpty().withMessage('Nastavite razvijalce')
                ];
            }

            case 'updateProject': {
                return [
                    body('name').trim().isLength({
                        min: 1,
                        max: 64
                    }).not().isEmpty().withMessage('Ime projekta ne sme biti prazno in mora biti manjše od 64 znakov'),
                    body('productLeader').not().isEmpty().withMessage('Nastavite produktnega vodjo'),
                    body('scrumMaster').not().isEmpty().withMessage('Nastavite vodjo metodologije'),
                    body('developers').not().isEmpty().withMessage('Nastavite razvijalce')
                ];
            }
        }
    }
};