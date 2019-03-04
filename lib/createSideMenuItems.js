const rights = require('../lib/rights');

module.exports = function (rootRoute, pageOptions) {
    const selectActiveRoute = function (right) {
        return {
            href: right.href,
            title: right.title,
            active: right.href === rootRoute
        };
    };
    
    if (pageOptions.isAdmin) {
        return rights.adminRights.map(selectActiveRoute);
    } else {
        return rights.userRights.map(selectActiveRoute);
    }  
};