const mongoose = require('mongoose');


const usersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [ /.+\@.+\..+/]
    },
    voterId:{
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    hasVote: {
        type: Boolean,
        default: false
    },
    totalVote: {
        type: Number,
        default: 0
    },

});

const Users = mongoose.model('User',usersSchema);

module.exports = Users;
