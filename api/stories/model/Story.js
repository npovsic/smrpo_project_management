const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Story', new Schema({
    _id: ObjectId,
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
        enum: [
            'M',  // Must have
            'S',  // Should have
            'C',  // Could have
            'W'   // Won't have
        ],
        default: 'M',
        required: true,
    },
    businessValue: Number,
    tasks: [ObjectId],
    sprintId: ObjectId,  // The sprint it belongs to, if at all
    rejectionReason: String,  // Empty if not rejected at end of sprint
    _lastUpdatedAt: Date,
    _createdAt: Date,
}));