const express = require('express');
const router = express.Router();

const overviewController = require('../controllers/overviewController');

const loginController = require('../controllers/loginController');

const buildBasePageOptions = require('../middlewares/buildBasePageOptions');


router.get('/', buildBasePageOptions, overviewController.overviewGet);

router.get('/login', buildBasePageOptions, loginController.loginGet);

router.post('/login', buildBasePageOptions, loginController.loginPost);

router.get('/logout', buildBasePageOptions, loginController.logoutGet);

module.exports = router;