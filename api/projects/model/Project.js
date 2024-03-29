const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProjectSchema = new Schema({
    id: ObjectId,
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    productLeader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scrumMaster: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    developers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    _lastUpdatedAt: Date,
    _createdAt: Date
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;