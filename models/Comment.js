const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    text: { type: String, required: true },
    like: { type: Number, required: true },
    authorId: { type: Types.ObjectId, ref: 'User' },
    authorAvatar: { type: String },
    postId: { type: Types.ObjectId, ref: 'Post' },
    date: { type: String} ,
    author: { type: String },
    whoLikes: {type: Array}
})

module.exports = model('Comment', schema)
