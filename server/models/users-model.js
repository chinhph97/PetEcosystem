const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        require: true,
        type: String
    },
    name: String,
    role: {
        type: String,
        enum: ['admin', 'normal', 'adminShop']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    address: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: Date
});
const Users = mongoose.model('Users', blogSchema);
module.exports = Users;