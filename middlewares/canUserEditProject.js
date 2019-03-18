const projectModule = require('../api/projects/methods');

/**
 * Only the administrator and the scrum master may edit project details
 * 
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports = async function (req, res, next) {
    const projectId = req.params.projectId;

    const currentUser = req.session.user;

    if (currentUser.role === 'system_admin') {
        next();

        return;
    }

    projectModule.isUserProjectScrumMaster(projectId, currentUser._id)
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
            console.log(ex);
            
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