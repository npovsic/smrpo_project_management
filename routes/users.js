const express = require('express');
const router = express.Router();

const userModule = require('../api/users/methods');

router.get('/', function (req, res, next) {
    userModule.findAll()
        .then(function (users) {
            res.json(users);
        })
        .catch(function (err) {
            console.log({ err });
        });
});

router.get('/:userId', function (req, res, next) {
    const userId = req.params.userId;

    console.log(userId);

    userModule.findOne({ _id: userId })
        .then(function (user) {
            console.log({ user });

            res.json(user);
        })
        .catch(function (err) {
            console.log({ err });
        });
});

router.get('/update/:userId', function (req, res, next) {
    const user = {
        username: 'admin',
        email: 'admin@project-management.si'
    };

    const updateResult = userModule.upsert(user)
        .then(function (updateResult) {
            res.json(updateResult);
        })
        .catch(function (err) {
            console.log({ err });
        });
});

module.exports = router;
