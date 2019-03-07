const { admin, user } = require('../lib/rights');

module.exports = function (rootRoute, pageOptions) {
    const selectActiveRoute = function (right) {
        return {
            href: right.href,
            title: right.title,
            active: right.href === rootRoute
        };
    };
    
    if (pageOptions.isAdmin) {
        return admin.rights.map(selectActiveRoute);
    } else {
        return user.rights.map(selectActiveRoute);
    }  
};