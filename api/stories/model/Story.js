const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const mongooseAutoIncrement = require('mongoose-auto-increment-reworked');

const priorities = require('../../../lib/priorities');

const StorySchema = new Schema({
    id: ObjectId,
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    ordinal: { // Number for users to refer to
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    acceptanceTests: String,
    score: Number,
    priority: {
        type: String,
        enum: priorities.values,
        required: true,
    },
    businessValue: Number,
    tasks: [ObjectId],
    sprint: { type: Schema.Types.ObjectId, ref: 'Sprint' },  // The sprint it belongs to, if at all
    rejectionReason: String,  // Empty if not rejected at end of sprint
    finished: {
        type: Boolean,
        default: false
    },  // Whether it is finished (if true, sprintId must be null)
    _lastUpdatedAt: Date,
    _createdAt: Date,
});

const plugin = new mongooseAutoIncrement.MongooseAutoIncrementID(StorySchema, 'MyModel', {
    field: 'ordinal',
    incrementBy: 1, 
    nextCount: false,
    resetCount: 'reset',
    startAt: 1,
    unique: true
});

plugin.applyPlugin()
    .then(() => {
        // Plugin ready to use! You don't need to wait for this promise - any save queries will just get queued.
        // Every document will have an auto-incremented number value on _id.
    })
    .catch(e => {
        // Plugin failed to initialise
    });

module.exports = mongoose.model('Story', StorySchema);