const admin = {
    userRole: 'admin',
    title: 'Administrator sistema',
    rights: [
        {
            href: '/',
            title: 'Pregled'
        },
        {
            href: '/projects',
            title: 'Projekti'
        },
        {
            href: '/sprints',
            title: 'Sprinti'
        },
        {
            href: '/users',
            title: 'Uporabniki'
        }
    ]
};

const user = {
    userRole: 'user',
    title: 'Uporabnik sistema',
    rights: [
        {
            href: '/',
            title: 'Pregled'
        },
        {
            href: '/projects',
            title: 'Projekti'
        },
        {
            href: '/sprints',
            title: 'Sprinti'
        }
    ]
};

module.exports = {
    admin,
    user
};