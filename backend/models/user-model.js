const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    oras: {type: String, required: true},
    judet: {type: String, required: true},
    resedinta: {type: String, required: true},
    avatar: {type: String, required: true},
    tel: {type: String, required: true},
    donated: {type: Array},
    follow: {type: Array},
    adoptReqSent: {type: Array},
    adoptReqClosed: {type: Array},
});

module.exports = mongoose.model('User', userSchema);