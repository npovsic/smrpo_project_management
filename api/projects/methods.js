const Project = require('./model/Project');

/**
 * These methods are used as middleware
 */
module.exports = {
    findAll: async function ()  {
        const projects = await Project.find({}).exec();
        
        return projects;
    },
    
    findOne: async function () {
        const project = await Project.findOne(...arguments).exec();
        
        return project;
    },
    
    insert: async function (projectData) {
        const project = new Project(projectData);

        return await project.save();
    },
    
    update: async function (projectId, projectData) {
        let projectInDatabase = await Project.findOne({ _id: projectId }).exec();

        // Object.assign copies all the values from the second argument into the first one, even if they both have the save values
        projectInDatabase = Object.assign(projectInDatabase, projectData);

        projectInDatabase.save();
    }
};