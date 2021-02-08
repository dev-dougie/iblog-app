const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    name: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Number,
        default: 1
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

mongoose.model('users', User)