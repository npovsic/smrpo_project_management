/**
 * Priorities for use in the priority field of a Story and their user-friendly
 * names.
 */
module.exports = {
    values: [
        'M',  // Must have
        'S',  // Should have
        'C',  // Could have
        'W'   // Won't have
    ],
    translations: {
        'M': 'Nujno (must have)',
        'S': 'Priporočljivo (should have)',
        'C': 'Zaželeno (could have)',
        'W': 'Nepotrebno (won\'t have)'
    }
};