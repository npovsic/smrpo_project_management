const sprintsModule = require('../api/sprints/methods');
const projectModule = require('../api/projects/methods');
const formatDate = require('../lib/formatDate');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = {
    sprintCreateGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;
        const projectId = req.params.projectId;

        // Add two weeks to the current date
        const endDate = new Date();

        endDate.setDate(endDate.getDate() + 14);

        const projectData = await projectModule.findOne({ _id: projectId });

        const sprintData = {
            startDate: formatDate(new Date()),
            endDate: formatDate(new Date(endDate))
        };

        pageOptions.sprintData = sprintData;

        pageOptions.existingSprints = await sprintsModule.findAllForProject(projectId);

        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: `/projects`
            },
            {
                title: projectData.name,
                href: `/projects/${projectId}`
            },
            {
                title: 'Ustvarjanje novega sprinta',
                href: `/projects/${projectId}/sprints/create`
            }
        ];

        pageOptions.projectId = projectId;

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

        const projectData = await projectModule.findOne({ _id: projectId });

        const pageOptions = req.pageOptions;
        pageOptions.sprintData = sprintData;
        pageOptions.existingSprints = await sprintsModule.findAllForProject(projectId);

        pageOptions.layoutOptions.headTitle = 'Ustvarjanje novega sprinta';
        pageOptions.layoutOptions.pageTitle = 'Ustvarjanje novega sprinta';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: `/projects`
            },
            {
                title: projectData.name,
                href: `/projects/${projectId}`
            },
            {
                title: 'Ustvarjanje novega sprinta',
                href: `/projects/${projectId}/sprints/create`
            }
        ];

        //form validation using express-validate
        pageOptions.errors = {};

        const errorValidation = validationResult(req);

        if (!errorValidation.isEmpty()) {
            errorValidation.array().forEach(function (error) {
                pageOptions.errors[error.param] = error.msg;
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
                    
                    body('startDate').exists().withMessage('Začetek sprinta ne sme biti prazen oz. nedoločen.'),
                    
                    body('endDate').exists().withMessage('Konec sprinta ne sme biti prazen oz. nedoločen.'),
                    
                    body('startDate').custom((startDate, { req }) => {
                        if (formatDate(startDate.getTime()) > formatDate(req.body.endDate.getTime())) {
                            return Promise.reject('Začetek sprinta ne more biti v preteklosti.');
                        } else if (formatDate(startDate.getTime()) < formatDate(new Date())) {
                            return Promise.reject('Konec sprinta ne more biti pred začetkom sprinta.');
                        }

                        return sprintsModule.checkIfBetween({
                            projectId: req.params.projectId,
                            startDate: formatDate(startDate),
                            endDate: formatDate(req.body.endDate)
                        }).then(sprints => {
                            if (sprints.length !== 0) {
                                return Promise.reject('Sprint se prekriva z že obstoječim v tem projektu.');
                            }
                        });
                    })
                ];
            }
        }
    }
};