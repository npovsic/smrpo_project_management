const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projectsController');
const sprintsController = require('../controllers/sprintsController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

const systemUserNotAuthorized = require('../middlewares/systemUserNotAuthorized');
const systemAdminNotAuthorized = require('../middlewares/systemAdminNotAuthorized');

/**
 * Root route to display all the projects
 */
router.get('/', function (req, res, next) {
    res.redirect('/');
});

/**
 * Route for creating a new project
 */
router.get('/create', systemUserNotAuthorized, buildBasePageOptions, projectsController.projectCreateGet);

router.post('/create', systemUserNotAuthorized, buildBasePageOptions, projectsController.validate('createProject'), projectsController.projectCreatePost);

/**
 * Route for project overview
 */
router.get('/:projectId', buildBasePageOptions, projectsController.projectOverview);

/**
 * Route for editing an existing project
 */
router.get('/:projectId/edit', systemUserNotAuthorized, buildBasePageOptions, projectsController.projectEditGet);

router.post('/:projectId/edit', systemUserNotAuthorized, buildBasePageOptions, projectsController.validate('updateProject'), projectsController.projectEditPost);


/**
 * Route for creating a new sprint
 */
router.get('/:projectId/sprints/create', systemAdminNotAuthorized, buildBasePageOptions, sprintsController.sprintCreateGet);

router.post('/:projectId/sprints/create', systemAdminNotAuthorized, buildBasePageOptions, sprintsController.validate('createSprint'), sprintsController.sprintCreatePost);

/**
 * Route for creating new user story
 */

router.get('/:projectId/stories/create', buildBasePageOptions, projectsController.addStoryGet);
//router.get('/:projectId/stories/create', buildBasePageOptions, projectsController.addStoryPost);

module.exports = router;