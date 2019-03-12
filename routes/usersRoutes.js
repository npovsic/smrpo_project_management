const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

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
router.get('/create', buildBasePageOptions, usersController.userCreateGet);

router.post('/create', buildBasePageOptions, usersController.validate('createUser'), usersController.userCreatePost);

/**
 * Route for user overview
 */
router.get('/:userId', buildBasePageOptions, usersController.userOverview);

module.exports = router;