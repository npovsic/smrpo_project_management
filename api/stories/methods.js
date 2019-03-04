const Story = require('./model/Story');

module.exports = {
    findAllForProject: async function (projectId) {
        const project = await Project.find({_id: projectId}).exec();

        return project.stories;
    },

    findOne: async function () {
        return await Story.findOne(...arguments).exec();
    },

    insert: async function (storyData) {
        return await new Story(storyData).save();
    },

    update: async function (storyData) {
        await Story.findOne({_id: storyData._id}).exec();
    },
};