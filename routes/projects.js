const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/isLoggedIn');

const projectModule = require('../api/projects/methods');

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
router.get('/create', isLoggedIn, function (req, res, next) {
    const pageOptions = {
        layoutOptions: {
            pageTitle: 'Pregled',
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
    const requestBody = req.body;

    const projectData = {
        name: requestBody.name
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
router.get('/:projectId', function (req, res, next) {

});

module.exports = router;
