const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projectsController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

/**
 * Root route to display all the projects
 */
router.get('/', function (req, res, next) {
    res.redirect('/');
});

/**
 * Route for creating a new project
 */
router.get('/create', buildBasePageOptions, projectsController.projectCreateGet);

router.post('/create', buildBasePageOptions, projectsController.validate('createProject'), projectsController.projectCreatePost);

/**
 * Route for project overview
 */
router.get('/:projectId', buildBasePageOptions, projectsController.projectOverview);

/**
 * Route for editing an existing project
 */
router.get('/:projectId/edit', buildBasePageOptions, projectsController.projectEditGet);

router.post('/:projectId/edit', buildBasePageOptions, projectsController.validate('updateProject'), projectsController.projectEditPost);

module.exports = router;
