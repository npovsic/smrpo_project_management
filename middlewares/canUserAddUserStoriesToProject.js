const projectModule = require('../api/projects/methods');

/**
 * Only the product leader and scrum master may add or edit user stories
 * 
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports = async function (req, res, next) {
    const projectId = req.params.projectId;

    const currentUser = req.session.user;
    
    projectModule.isUserProjectProductLeaderOrScrumMaster(projectId, currentUser._id)
        .then(project => {
            if (project) {
                next();
            } else {
                const pageOptions = {
                    layoutOptions: {
                        headTitle: 'Nimate pravic za ogled strani',
                        backgroundClass: 'background',
                        navBar: {
                            show: false,
                            breadcrumbs: null,
                            buttons: null
                        },
                        sideMenu: {
                            show: false,
                            items: null
                        }
                    }
                };

                res.render('unauthorized', pageOptions);
            }
        })
        .catch((ex) => {
            const pageOptions = {
                layoutOptions: {
                    headTitle: 'Nimate pravic za ogled strani',
                    backgroundClass: 'background',
                    navBar: {
                        show: false,
                        breadcrumbs: null,
                        buttons: null
                    },
                    sideMenu: {
                        show: false,
                        items: null
                    }
                }
            };

            res.render('unauthorized', pageOptions);
        });
};