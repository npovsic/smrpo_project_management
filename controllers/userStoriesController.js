const projectModule = require('../api/projects/methods');
const storyModule = require('../api/stories/methods');

const priorities = require('../lib/priorities');

const { body, validationResult } = require('express-validator/check');

module.exports = {
    addStoryGet: async function (req, res, next) {
        const pageOptions = req.pageOptions;

        const projectId = req.params.projectId;

        const projectData = await projectModule.findOne({ _id: projectId });

        const prioritySelectObjects = [];
        
        for (const priorityValue in priorities.translations) {
            prioritySelectObjects.push({
                value: priorityValue,
                title: priorities.translations[priorityValue]
            });
        }
        
        pageOptions.prioritySelectObjects = prioritySelectObjects;

        pageOptions.layoutOptions.headTitle = `Dodajanje uporabniske zgodbe`;

        pageOptions.layoutOptions.pageTitle = 'Dodajanje uporabniske zgodbe';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: projectData.name,
                href: `/projects/${projectId}`
            },
            {
                title: 'Dodaj uporabniško zgodbo',
                href: `/projects/${projectId}/addUserStory`
            }
        ];

        pageOptions.projectId = projectId;

        res.render('./userStories/userStoriesEditPage', pageOptions);
    },

    addStoryPost: async function (req, res, next) {
        const projectId = req.params.projectId;

        const postData = req.body;

        const storyData = {
            project: projectId,
            title: postData.title,
            description: postData.description,
            acceptanceTests: postData.acceptanceTests,
            priority: postData.priority,
            businessValue: postData.businessValue
        };
        
        const pageOptions = req.pageOptions;

        const prioritySelectObjects = [];

        for (const priorityValue in priorities.translations) {
            const selectObject = {
                value: priorityValue,
                title: priorities.translations[priorityValue]
            };
            
            if (storyData.priority && storyData.priority === selectObject.value) {
                selectObject.selected = true;
            }
            
            prioritySelectObjects.push(selectObject);
        }

        pageOptions.prioritySelectObjects = prioritySelectObjects;

        pageOptions.layoutOptions.headTitle = `Dodajanje uporabniske zgodbe`;

        pageOptions.layoutOptions.pageTitle = 'Dodajanje uporabniske zgodbe';

        pageOptions.layoutOptions.navBar.breadcrumbs = [
            {
                title: 'Projekti',
                href: '/projects'
            },
            {
                title: storyData.name,
                href: `/projects/${projectId}`
            },
            {
                title: 'Dodaj uporabniško zgodbo',
                href: `/projects/${projectId}/addUserStory`
            }
        ];

        pageOptions.storyData = storyData;

        pageOptions.projectId = projectId;

        pageOptions.errors = {};

        const errorValidation = validationResult(req);

        if (!errorValidation.isEmpty()) {
            errorValidation.array().forEach(function (error) {
                pageOptions.errors[error.param] = error.msg;
            });

            res.render('./userStories/userStoriesEditPage', pageOptions);
        } else {
            storyModule.insert(storyData)
                .then(function (result) {
                    console.log(result);
                    res.redirect(`/projects/${projectId}`);
                })
                .catch(function (err) {
                    console.log(err);

                    res.render('./userStories/userStoriesEditPage', pageOptions);
                });
        }
    },

    validate(method) {
        switch (method) {
            case 'createUserStory': {
                return [
                    body('title').trim().not().isEmpty().withMessage('Naslov uporabniške zgodbe ne sme biti prazen'),

                    body('title').custom(value => {
                        return storyModule.findOne({ title: value }).then(user => {
                            if (user) {
                                return Promise.reject('Uporabniška zgodba s tem naslovom že obstaja');
                            }
                        })
                    }),
                    
                    body('description').trim().not().isEmpty().withMessage('Opis uporabniške zgodbe ne sme biti prazen'),
                    
                    body('priority').trim()
                        .isIn(priorities.values).withMessage('Izbrana prioriteta ni med ustreznimi možnostmi')
                        .not().isEmpty().withMessage('Določite prioriteto'),
                    
                    body('businessValue').custom(value => {
                        console.log('businessValue', value);
                        
                        const parsedValue = parseInt(value);
                        
                        return !isNaN(parsedValue);
                    }).withMessage('Vrednost mora biti število')
                        .custom(value => {
                            return !(value >= 0 && value >= 10);
                        }).withMessage('Vrednost mora biti med 0 in 10')
                ];
            }
        }
    }
};