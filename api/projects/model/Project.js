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
    projectLeader: { type: Schema.Types.ObjectId, ref: 'User' },
    scrumMaster: { type: Schema.Types.ObjectId, ref: 'User' },
    developers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
    _lastUpdatedAt: Date,
    _createdAt: Date
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;