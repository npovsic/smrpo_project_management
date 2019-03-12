const express = require('express');
const router = express.Router();

const sprintsController = require('../controllers/sprintsController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

/**
 * Root route to display all the users
 */
router.get('/', function (res, req, next) {
    res.redirect('/');
});

/**
 * Route for creating a new user
 */
router.get('/create', buildBasePageOptions, sprintsController.validate('createSprint'), sprintsController.sprintCreateGet);

router.post('/projects/:projectId/sprint/create', buildBasePageOptions, sprintsController.validate('createUser'), usersController.userCreatePost);

module.exports = router;