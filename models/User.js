const { Schema, model } = require('mongoose')

const schema = new Schema({
    // name: { type: String, required: true},
    // surname: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true,},
    password: { type: String, required: true },
    like: { type: Number, required: true },
    avatar: { type: String, required: false, }
})

module.exports = model('User', schema)
