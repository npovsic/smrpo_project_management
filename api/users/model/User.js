const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userRoles = [ 'admin', 'razvijalec' ];

const UserSchema = new Schema({
    id: ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: userRoles
    },
    _lastUpdatedAt: Date,
    _createdAt: Date
});

const User = mongoose.model('User', UserSchema);

module.exports = User;