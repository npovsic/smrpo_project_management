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
        'M': 'nujno (must have)',
        'S': 'priporočljivo (should have)',
        'C': 'zaželeno (could have)',
        'W': "nepotrebno (won't have)"
    },
};