const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    title: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    like: { type: Number, required: true },
    authorId: { type: Types.ObjectId, ref: 'User' },
    authorAvatar: { type: String },
    date: { type: String} ,
    author: { type: String },
    whoLikes: {type: Array}
})

module.exports = model('Post', schema)
