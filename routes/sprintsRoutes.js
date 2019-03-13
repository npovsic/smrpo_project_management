const express = require('express');
const router = express.Router();

const sprintsController = require('../controllers/sprintsController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

const systemAdminNotAuthorized = require('../middlewares/systemAdminNotAuthorized');

/**
 * Root route to display all the users
 */
router.get('/', function (res, req, next) {
    res.redirect('/');
});

/**
 * Route for creating a new user
 */
router.get('/create', systemAdminNotAuthorized, buildBasePageOptions, sprintsController.sprintCreateGet);

router.post('/create', systemAdminNotAuthorized, buildBasePageOptions, sprintsController.validate('createSprint'), sprintsController.sprintCreatePost);

module.exports = router;