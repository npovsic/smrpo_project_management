const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const priorities = require('../../../lib/priorities');

module.exports = mongoose.model('Story', new Schema({
    id: ObjectId,
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    ordinal: Number,  // Number for users to refer to
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        unique: true,
        required: true,
    },
    acceptanceTests: String,
    score: Number,
    priority: {
        type: String,
        enum: priorities.values,
        default: 'M',
        required: true,
    },
    businessValue: Number,
    tasks: [ObjectId],
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint' },  // The sprint it belongs to, if at all
    rejectionReason: String,  // Empty if not rejected at end of sprint
    finished: Boolean,  // Whether it is finished (if true, sprintId must be null)
    _lastUpdatedAt: Date,
    _createdAt: Date,
}));