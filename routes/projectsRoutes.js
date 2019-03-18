const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projectsController');
const sprintsController = require('../controllers/sprintsController');
const userStoriesController = require('../controllers/userStoriesController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

const systemUserNotAuthorized = require('../middlewares/systemUserNotAuthorized');
const systemAdminNotAuthorized = require('../middlewares/systemAdminNotAuthorized');

const canUserViewProject = require('../middlewares/canUserViewProject');
const canUserEditProject = require('../middlewares/canUserEditProject');
const canUserAddUserStoriesToProject = require('../middlewares/canUserAddUserStoriesToProject');
const canUserAddSprintsToProject = require('../middlewares/canUserAddSprintsToProject');

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
router.get('/:projectId', canUserViewProject, buildBasePageOptions, projectsController.projectOverview);


/**
 * Route for editing an existing project
 */
router.get('/:projectId/edit', canUserEditProject, buildBasePageOptions, projectsController.projectEditGet);

router.post('/:projectId/edit', canUserEditProject, buildBasePageOptions, projectsController.validate('updateProject'), projectsController.projectEditPost);


/**
 * Route for creating a new sprint
 */
router.get('/:projectId/sprints/create', systemAdminNotAuthorized, canUserAddSprintsToProject, buildBasePageOptions, sprintsController.sprintCreateGet);

router.post('/:projectId/sprints/create', systemAdminNotAuthorized, canUserAddSprintsToProject, buildBasePageOptions, sprintsController.validate('createSprint'), sprintsController.sprintCreatePost);


/**
 * Route for creating new user story
 */
router.get('/:projectId/stories/create', systemAdminNotAuthorized, canUserAddUserStoriesToProject, buildBasePageOptions, userStoriesController.addStoryGet);

router.post('/:projectId/stories/create', systemAdminNotAuthorized, canUserAddUserStoriesToProject, buildBasePageOptions, userStoriesController.validate('createUserStory'), userStoriesController.addStoryPost);


module.exports = router;