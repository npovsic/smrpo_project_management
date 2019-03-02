const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProjectSchema = new Schema({
    id: ObjectId,
    name: {
        type: String,
        required: true
    },
    description: String,
    projectLeader: ObjectId,
    scrumMaster: ObjectId,
    developers: [ObjectId],
    _lastUpdatedAt: Date,
    _createdAt: Date
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;