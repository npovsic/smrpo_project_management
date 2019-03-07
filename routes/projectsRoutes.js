const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projectsController');

const redirectAdmin = require('../middlewares/redirectAdmin');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

/**
 * Root route to display all the projects
 */
router.get('/', redirectAdmin, buildBasePageOptions, projectsController.projectsList);

/**
 * Route for creating a new project
 */
router.get('/create', buildBasePageOptions, projectsController.projectCreateGet);

router.post('/create', buildBasePageOptions, projectsController.projectCreatePost);

/**
 * Route for project overview
 */
router.get('/:projectId', buildBasePageOptions, projectsController.projectOverview);

/**
 * Route for editing an existing project
 */
router.get('/:projectId/edit', buildBasePageOptions, projectsController.projectEditGet);

router.post('/:projectId/edit', buildBasePageOptions, projectsController.projectEditPost);

module.exports = router;
