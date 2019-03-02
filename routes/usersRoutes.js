const express = require('express');
const router = express.Router();

const userModule = require('../api/users/methods');

router.get('/', function (req, res, next) {
    userModule.findAll()
        .then(function (users) {
            
        })
        .catch(function (err) {
            console.log({ err });
        });
});

module.exports = router;
