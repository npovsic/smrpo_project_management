const hbs = require('hbs');

hbs.registerHelper('ifEqual', function (v1, v2, options) {
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