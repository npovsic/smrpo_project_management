const Sprint = require('./model/Sprint');
const Project = require('../projects/model/Project');


module.exports = {
    findAllForProject: async function (projectId) {
        const project = await Project.find({_id: projectId}).exec();

        return project.stories;
    },

    findOne: async function () {
        return await Sprint.findOne(...arguments).exec();
    },

    checkIfBetween: async function (sprintData) {
        const sprints = await Sprint.find({
            $and: [
                {projectId : sprintData.projectId},
                {$or : [
                    {$and : [
                        {startDate: {$gte: new Date(sprintData.startDate)}},
                        {startDate: {$lte: new Date(sprintData.endDate)}}
                    ]},
                    {$and : [
                       {endDate: {$gte: new Date(sprintData.startDate)}},
                       {endDate: {$lte: new Date(sprintData.endDate)}}
                    ]}
                ]}
            ]
        }).exec();

        return sprints;
    },

    findActiveSprintFromProject: async function (projectId) {
        const currentDate = new Date();
        const activeSprint = await Sprint.find({
            $and: [
                {projectId: projectId},
                {$and: [
                    {startDate: {$lte: new Date(currentDate)}},
                    {endDate: {$gte: new Date(currentDate)}}
                ]}
            ]
        }).exec();

        return activeSprint;
    },

    findActiveSprintsFromAllProjects: async function (projects) {
        return {};
    },

    findNotActiveSprintsFromProject: async function(projectId) {
        const currentDate = new Date();
        const inactiveSprints = await Sprint.find({
            $and: [
                {projectId: projectId},
                {$or: [
                    {startDate: {$gt: new Date(currentDate)}},
                    {endDate: {$lt: new Date(currentDate)}}
                ]}
            ]
        }).sort({endDate: -1}).exec();

        return inactiveSprints;
    },

    insert: async function (storyData) {
        return await new Sprint(storyData).save();
    },

    update: async function (storyData) {
        await Sprint.findOne({_id: storyData._id}).exec();
    },
};