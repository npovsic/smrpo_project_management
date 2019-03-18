const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Sprint', new Schema({
    id: ObjectId,
    startDate: Date,
    endDate: Date,
    expectedVelocity: {
        type: Number,
        required: true
    },
    velocity: Number,
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    _lastUpdatedAt: Date,
    _createdAt: Date
}));