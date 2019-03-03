const express = require('express');
const router = express.Router();

const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

/**
 * Root route to display all the projects
 */
router.get('/', async function (req, res, next) {
    try {
        const projects = await projectModule.findAll();

        if (req.session.userRole === 'admin') {
            const pageOptions = {
                projects,
                isAdmin: true,
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
                        show: true,
                        items: [
                            {
                                title: 'Pregled',
                                href: '/'
                            },
                            {
                                title: 'Projekti',
                                href: '/projects',
                                active: true
                            }
                        ]
                    }
                }
            };

            res.render('./projects/projectsPage', pageOptions);
        } else {

        }
    } catch (ex) {
        console.log(ex);
    }
});

/**
 * Route for creating a new project
 */
router.get('/create', async function (req, res, next) {
    const users = await usersModule.findAll();

    const pageOptions = {
        users,
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
                show: true,
                items: [
                    {
                        title: 'Pregled',
                        href: '/'
                    },
                    {
                        title: 'Projekti',
                        href: '/projects',
                        active: true
                    }
                ]
            }
        }
    };

    res.render('./projects/projectEditPage', pageOptions);
});

router.post('/create', function (req, res, next) {
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
});

/**
 * Route for editing an existing project
 */
router.get('/:projectId', async function (req, res, next) {
    const projectId = req.params.projectId;

    const users = await usersModule.findAll();

    const projectData = await projectModule.findOne({ _id: projectId });

    const populatedUsers = {
        usersForProjectLeader: users.map((user) => {
            const isUserProjectLeader = projectData.projectLeader && projectData.projectLeader.equals(user._id);
            
            return {
                value: user._id,
                title: user.username,
                selected: isUserProjectLeader
            }
        }),
        usersForScrumMaster: users.map((user) => {
            const isUserScrumMaster = projectData.scrumMaster && projectData.scrumMaster.equals(user._id);

            return {
                value: user._id,
                title: user.username,
                selected: isUserScrumMaster
            }
        }),
        usersForDevelopers: users.map((user) => {
            const isUserADeveloper = projectData.developers && projectData.developers.find((developerId) => developerId.equals(user._id));

            return {
                value: user._id,
                title: user.username,
                selected: isUserADeveloper
            }
        })
    };

    const pageOptions = {
        populatedUsers,
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
                show: true,
                items: [
                    {
                        title: 'Pregled',
                        href: '/'
                    },
                    {
                        title: 'Projekti',
                        href: '/projects',
                        active: true
                    }
                ]
            }
        }
    };

    res.render('./projects/projectEditPage', pageOptions);
});

/**
 * Route for updating an existing project
 */
router.post('/:projectId', async function (req, res, next) {
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
});

module.exports = router;
