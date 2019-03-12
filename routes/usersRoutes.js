const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');

const systemUserNotAuthorized = require('../middlewares/systemUserNotAuthorized');

/**
 * Root route to display all the users
 */
router.get('/', function (req, res, next) {
    res.redirect('/');
});

/**
 * Route for creating a new user
 */
router.get('/create', systemUserNotAuthorized, buildBasePageOptions, usersController.userCreateGet);

router.post('/create', systemUserNotAuthorized, buildBasePageOptions, usersController.validate('createUser'), usersController.userCreatePost);

/**
 * Route for user overview
 */
router.get('/:userId', systemUserNotAuthorized, buildBasePageOptions, usersController.userOverview);

module.exports = router;