const Sprint = require('./model/Sprint');

module.exports = {
    /**
     * Gets all sprints for a project, sorted by ascending start date.
     */
    findAllForProject: async function (projectId) {
        return await Sprint.find({ projectId: projectId }).sort({ startDate: 1 }).exec();
    },

    findOne: async function () {
        return await Sprint.findOne(...arguments).exec();
    },

    checkIfBetween: async function (sprintData) {
        const sprints = await Sprint.find({
            $and: [
                { projectId: sprintData.projectId },
                {
                    $or: [
                        {
                            $and: [
                                { startDate: { $gte: new Date(sprintData.startDate) } },
                                { startDate: { $lte: new Date(sprintData.endDate) } }
                            ]
                        },
                        {
                            $and: [
                                { endDate: { $gte: new Date(sprintData.startDate) } },
                                { endDate: { $lte: new Date(sprintData.endDate) } }
                            ]
                        }
                    ]
                }
            ]
        }).exec();

        return sprints;
    },

    findActiveSprintFromProject: async function (projectId) {
        const currentDate = new Date();
        const activeSprint = await Sprint.find({
            $and: [
                { projectId: projectId },
                {
                    $and: [
                        { startDate: { $lte: new Date(currentDate) } },
                        { endDate: { $gte: new Date(currentDate) } }
                    ]
                }
            ]
        }).exec();

        return activeSprint;
    },

    findActiveSprintsFromUsersProjects: async function (projects) {
        const activeSprints = [];
        projects.forEach(async function(projectData) {
            const sprint = await module.exports.findActiveSprintFromProject(projectData._id);
            sprint.project = projectData;

            if(sprint[0]){
                console.log("got here");
                activeSprints.push({"sprint": sprint[0], "project": projectData});
            }
        });

        return activeSprints;
    },

    findNotActiveSprintsFromProject: async function (projectId) {
        const currentDate = new Date();
        const inactiveSprints = await Sprint.find({
            $and: [
                { projectId: projectId },
                {
                    $or: [
                        { startDate: { $gt: new Date(currentDate) } },
                        { endDate: { $lt: new Date(currentDate) } }
                    ]
                }
            ]
        }).sort({ endDate: -1 }).exec();

        return inactiveSprints;
    },

    insert: async function (storyData) {
        return await new Sprint(storyData).save();
    },

    update: async function (storyData) {
        await Sprint.findOne({ _id: storyData._id }).exec();
    },
};