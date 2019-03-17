const hbs = require('hbs');

const moment = require('moment');

const userRoles = require('./userRoles');

const priorities = require('./priorities');

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

/**
 * Formats a date (without a time) for display.
 */
hbs.registerHelper('formatDate', function (date) {
    moment.locale('sl');

    date = moment(date);
    
    let dateFormat = 'D. MMMM YYYY';

    return date.format(dateFormat);
});

/**
 * Formats a date and time for display.
 */
hbs.registerHelper('formatDateAndTime', function (dateAndTime) {
    moment.locale('sl');

    dateAndTime = moment(dateAndTime);

    let dateAndTimeFormat = 'D. MMMM YYYY, HH:mm';

    return dateAndTime.format(dateAndTimeFormat);
});

hbs.registerHelper('getUserRoleName', function (userRole) {
    return userRoles.translations[userRole];
});

/**
 * Takes a priority (as found a Story's priority field) and returns a user
 * friendly string for it.
 */
hbs.registerHelper('getPriorityName', function (priority) {
    return priorities.translations[priority];
});

/**
 * Takes a string and safely converts it to HTML for display, replacing all
 * line breaks with <br> tags.
 */
hbs.registerHelper('convertLineBreaks', function (text) {
    text =
        hbs.Utils.escapeExpression(text)
        .replace(/(\r\n|\n|\r)/gm, '<br>');

    return new hbs.SafeString(text);
});