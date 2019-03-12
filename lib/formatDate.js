module.exports = function (date) {
    const selectedDate = new Date(date);
    
    return new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
};