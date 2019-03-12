const Sprint = require('./model/Sprint');

module.exports = {
    findAllForProject: async function (projectId) {
        const project = await Project.find({_id: projectId}).exec();

        return project.stories;
    },

    findOne: async function () {
        return await Sprint.findOne(...arguments).exec();
    },

    findAllActiveForUser: async function (userId) {
        //find all the sprints where this userId is in developers
        const sprints = await Sprint.find({
            scrumMaster : userId
        }).exec();

        return sprints;
    },

    /*checkIfBetween: async function (projectId, startDate, endDate) {
        const sprints = await Sprint.find({
                {project : projectId}
        });

        return sprints;
    },*/

    insert: async function (storyData) {
        return await new Sprint(storyData).save();
    },

    update: async function (storyData) {
        await Sprint.findOne({_id: storyData._id}).exec();
    },
};