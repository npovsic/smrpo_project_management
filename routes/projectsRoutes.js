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
 * Route for editing an existing project
 */
router.get('/:projectId', buildBasePageOptions, projectsController.projectEditGet);

router.post('/:projectId', buildBasePageOptions, projectsController.projectEditPost);

module.exports = router;
