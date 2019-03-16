const usersModule = require('../api/users/methods');
const sprintsModule = require('../api/sprints/methods');
const formatDate = require('../lib/formatDate');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


module.exports = {
	sprintCreateGet: async function (req, res, next) {
		const pageOptions = req.pageOptions;
        const projectId = req.params.projectId;

        //add two weeks to the current date
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 14);
        console.log(endDate);

        const sprintData = {
            startDate: formatDate(new Date()),
            endDate: formatDate(new Date(endDate))
        };
        pageOptions.sprintData = sprintData;

        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';
        
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekt',
                href: `/projects/${projectId}`
            },
            {
                title: 'Ustvarjanje novega sprinta',
                href: `/projects/${projectId}/sprints/create`
            }
        ];

        res.render('./sprints/sprintEditPage', pageOptions);
	},

    sprintCreatePost: async function (req, res, next) {
        const postData = req.body;
        const projectId = req.params.projectId;

        const sprintData = {
            startDate: formatDate(new Date(postData.startDate)),
            endDate: formatDate(new Date(postData.endDate)),
            velocity: postData.velocity,
            projectId: projectId,
            _lastUpdatedAt: new Date(),
            _createdAt: new Date()
        };

            
        const pageOptions = req.pageOptions;
        pageOptions.sprintData = sprintData;
        
        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekt',
                href: `/projects/${projectId}`
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
                    res.redirect(`/projects/${projectId}`);
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
                    sanitizeBody('startDate').toDate(),
                    sanitizeBody('endDate').toDate(),
                    body('startDate').exists().withMessage('Začetek sprinta ne sme biti prazen oziroma ne določen'),
                    body('endDate').exists().withMessage('Začetek sprinta ne sme biti prazen oziroma ne določen'),
                    body('startDate').custom((startDate, { req }) => {
                        if(formatDate(startDate.getTime()) > formatDate(req.body.endDate.getTime())) {
                            return Promise.reject("Konec sprinta ne more biti pred začetkom sprinta");
                        } else if(formatDate(startDate.getTime()) < formatDate(new Date())){
                            return Promise.reject("Začetek sprinta ne more biti v preteklosti");
                        } 
                        
                        return sprintsModule.checkIfBetween({ "projectId": req.params.projectId,  "startDate": formatDate(startDate), "endDate": formatDate(req.body.endDate)}).then(sprints => {
                            if(sprints.length != 0) {
                                return Promise.reject('Izvajanje sprinata se prekriva z drugim že ustvarjenim v tem projektu');
                            }
                        });
                    }),
                    body('velocity').exists().withMessage('Hitrost sprinta mora biti definirana'),
                    body('velocity').custom(value  => {
                        if(parseInt(value) <= 0 ){
                            return Promise.reject('Hitrost sprinta mora biti pozitivno število večje od 0');
                        } else if(parseFloat(value) % 1 != 0) {
                            return Promise.reject('Hitrost sprinta mora biti definirana z celimi števili');
                        }
                        return true;
                    })
                ];
            }
        }
    }
}