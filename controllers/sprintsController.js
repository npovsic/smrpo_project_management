const usersModule = require('../api/users/methods');
const sprintsModule = require('../api/sprints/methods');
const { body, validationResult } = require('express-validator/check');


module.exports = {
	sprintCreateGet: async function (req, res, next) {
		const pageOptions = req.pageOptions;

        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/'
            },
            {
                title: 'Ustvarjanje novega sprinta',
                href: '/users/create'
            }
        ];

        res.render('./sprints/sprintEditPage', pageOptions);
	},

    sprintCreatePost: async function (req, res, next) {
        const postData = req.body;
        const projectId = req.params.projectId;

        const sprintData = {
            startDate: postData.startDate,
            endDate: postData.endDate,
            velocity: postData.velocity,
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

            
        const pageOptions = req.pageOptions;
        pageOptions.sprintData = sprintData;
        
        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/'
            },
            {
                title: 'Ustvarjanje novega sprinta',
                href: '/users/create'
            }
        ];

        //form validation using express-validate
        pageOptions.errors = {};
        
        const errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            errorValidation.array().forEach(function (ele) {
                pageOptions.errors[ele.param] = ele.msg;
            });

            res.render('./sprints/sprintEditPage', pageOptions);
        } else {
            sprintsModule.insert(sprintData)
                .then(function (result) {
                    console.log(result);
                    res.redirect('/projects/' + projectId + '/sprint/create');
                })
                .catch(function (err) {
                    console.log(err);
                    res.render('./sprints/usersEditPage', pageOptions);
                });
        }
    },

    validate: function (method) {
        switch (method) {
            case 'createSprint': {
                return [
                    body('startDate').exists().withMessage('Začetek sprinta ne sme biti prazen oziroma ne določen'),
                    body('startDate').custom(value => {
                        if(value < Date()){
                            return Promise.reject('Začetek sprinta ne sme biti v preteklosti');
                        }
                    }).withMessage('Začetek sprinta ne sme biti v preteklosti'),
                    body('endDate').exists().withMessage('Začetek sprinta ne sme biti prazen oziroma ne določen'),
                    body('endDate').custom(value => {
                        if(value < Date()){
                            return Promise.reject('Konec sprinta ne sme biti v preteklosti');
                        }
                    }).withMessage('Začetek sprinta ne sme biti v preteklosti'),
                    /*body('endDate').custom((value, { req }) => {
                        
                    }),*/
                    body('velocity').exists().withMessage('Hitrost sprinta mora biti definirana'),
                    body('velocity').isDecimal().withMessage('Hitrost sprinta mora biti definirana z celimi števili'),
                    body('velocity').custom(value  => {
                        if(value < 0 || value > 10){
                            return Promise.reject('Hitrost sprinta mora biti med 1 in 10');
                        }
                    })
                ];
            }
        }
    }
}