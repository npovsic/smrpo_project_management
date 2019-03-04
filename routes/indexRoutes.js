const express = require('express');
const router = express.Router();

const overviewController = require('../controllers/overviewController');

const loginController = require('../controllers/loginController');

router.get('/', overviewController.overviewGet);

router.get('/login', loginController.loginGet);

router.post('/login', loginController.loginPost);

router.get('/logout', loginController.logoutGet);

module.exports = router;