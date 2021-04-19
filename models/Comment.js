const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    text: { type: String, required: true },
    like: { type: Number, required: true },
    authorId: { type: Types.ObjectId, ref: 'User' },
    postId: { type: Types.ObjectId, ref: 'Post' },
    date: { type: Date} ,
    author: { type: String },
    whoLikes: {type: Array}
})

module.exports = model('Comment', schema)
