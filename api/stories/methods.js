const Story = require('./model/Story');

module.exports = {
    find: async function () {
        return await Story.find(...arguments).exec();
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