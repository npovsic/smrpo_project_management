const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const deepPopulate = require('mongoose-deep-populate')(mongoose);

const UserSchema = new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;