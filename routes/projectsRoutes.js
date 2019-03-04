const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projectsController');

/**
 * Root route to display all the projects
 */
router.get('/', projectsController.projectsList);

/**
 * Route for creating a new project
 */
router.get('/create', projectsController.projectCreateGet);

router.post('/create', projectsController.projectCreatePost);

/**
 * Route for editing an existing project
 */
router.get('/:projectId', projectsController.projectEditGet);

router.post('/:projectId', projectsController.projectEditPost);

module.exports = router;
