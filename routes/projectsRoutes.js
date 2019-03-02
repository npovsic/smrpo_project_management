const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/isLoggedIn');

const projectModule = require('../api/projects/methods');
const usersModule = require('../api/users/methods');

/**
 * Root route to display all the projects
 */
router.get('/', isLoggedIn, async function (req, res, next) {
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
router.get('/create', isLoggedIn, async function (req, res, next) {
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

router.post('/create', isLoggedIn, function (req, res, next) {
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
router.get('/:projectId', isLoggedIn, async function (req, res, next) {
    const projectId = req.params.projectId;
    
    const users = await usersModule.findAll();
    
    const projectData = await projectModule.findOne({ _id: projectId });

    const pageOptions = {
        users,
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
router.post('/:projectId', isLoggedIn, async function (req, res, next) {
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
