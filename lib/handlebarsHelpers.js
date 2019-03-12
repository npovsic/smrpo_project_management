const hbs = require('hbs');

const moment = require('moment');

const userRoles = require('./userRoles');

hbs.registerHelper('equals', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

hbs.registerHelper('includes', function (array, element) {
    const elementToCompare = JSON.stringify(element);

    for (const arrayElement of array) {
        if (JSON.stringify(arrayElement) === elementToCompare) return true;
    }

    return false;
});

hbs.registerHelper('formatDate', function (date) {
    moment.locale('sl');

    date = moment(date);

    return date.format('D. MMMM YYYY, HH:mm');
});

hbs.registerHelper('getUserRoleName', function (userRole) {
    return userRoles.translations[userRole];
});