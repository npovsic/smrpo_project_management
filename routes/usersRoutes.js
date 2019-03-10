const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

const redirectAdmin = require('../middlewares/redirectAdmin');
const buildBasePageOptions = require('../middlewares/buildBasePageOptions');


/**
 * Root route to display all the users
 */
router.get('/', redirectAdmin, buildBasePageOptions, usersController.usersList);

/**
 * Route for creating a new project
 */
router.get('/create', buildBasePageOptions, usersController.userCreateGet);

router.post('/create', buildBasePageOptions, usersController.userCreatePost);

module.exports = router;