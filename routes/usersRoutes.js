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
 * Route for creating a new project
 */
router.get('/create', buildBasePageOptions, usersController.userCreateGet);

router.post('/create', buildBasePageOptions, usersController.validate('createUser'), usersController.userCreatePost);

module.exports = router;