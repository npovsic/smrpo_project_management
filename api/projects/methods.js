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

    findAllForUser: async function (userId) {
        //find all the projects where this userId is in developers
        const projects = await Project.find({
            $or: [
                { productLeader : userId },
                { scrumMaster : userId }
            ]
            
        }).exec();

        console.log(projects);
        return projects;
    },
    
    insert: async function (projectData) {
        const project = new Project(projectData);

        return project.save();
    },
    
    update: async function (projectId, projectData) {
        let projectInDatabase = await Project.findOne({ _id: projectId }).exec();
        
        /*
            Object.assign copies all the values from the second argument into the first one, even if they both have the save values
            This means all the new updated values will be written to the object in the database and all the unchanged will be preserved
         */
        projectInDatabase = Object.assign(projectInDatabase, projectData);

        return projectInDatabase.save();
    }
};