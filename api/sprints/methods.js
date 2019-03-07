const Sprint = require('./model/Sprint');

module.exports = {
    findAllForProject: async function (projectId) {
        const project = await Project.find({_id: projectId}).exec();

        return project.stories;
    },

    findOne: async function () {
        return await Sprint.findOne(...arguments).exec();
    },

    insert: async function (storyData) {
        return await new Sprint(storyData).save();
    },

    update: async function (storyData) {
        await Sprint.findOne({_id: storyData._id}).exec();
    },
};