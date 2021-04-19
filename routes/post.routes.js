const { Router } = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')
const Fuse = require('fuse.js')
const moment = require('moment')

// /api/post/add
router.post(
  '/add', async (req, res) => {
    try {
      const {title, text, like, authorId, author} = req.body
      const post = new Post({
        title,
        text,
        like,
        author,
        authorId,
        date: moment().format('DD.MM.YYYY HH:mm')
      })

      await post.save()
      
      res.status(201).json({ message: 'Вопрос создан' })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', e })
  }
})

router.post(
  '/posts-id', async (req, res) => {
    try {
      const allPosts = await Post.find({authorId: req.body.authorId})
      res.json(allPosts)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/posts', async (req, res) => {
    try {
      const allPosts = await Post.find()
      res.json(allPosts)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/post', async (req, res) => {
    try {
      const post = await Post.findOne({_id: req.body.id})
      res.json(post)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/add-like', async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.body.id })
      const user = await User.findOne({ _id: post.authorId })

      if (!post.whoLikes.includes(req.body.userId)) {
        post.whoLikes.push(req.body.userId)
        post.like++
        user.user++
      } else {
        const index = post.whoLikes.indexOf(req.body.userId);
        post.whoLikes.splice(index, 1);
        post.like--
        user.user--
      }
      await post.save()
      await user.save()

      res.json(post)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/add-comment', async (req, res) => {
    try {
      const { text, authorId, postId } = req.body
      const author = await User.findOne({ _id: authorId })
      const comment = new Comment({
        text,
        like: 0,
        authorId,
        postId: postId,
        author: author.login,
        date: moment().format('DD.MM.YYYY HH:mm')
      })

      await comment.save()
      
      const comments = await Comment.find()
      res.json(comments)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', e })
  }
})

router.post(
  '/comments-id', async (req, res) => {
    try {
      const comments = await Comment.find({postId: req.body.postId})
      res.json(comments)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/like-comment', async (req, res) => {
    try {
      const comment = await Comment.findOne({ _id: req.body.id })
      const user = await User.findOne({ _id: comment.authorId })

      if (!comment.whoLikes.includes(req.body.userId)) {
        comment.whoLikes.push(req.body.userId)
        comment.like++
        user.like++
      } else {
        const index = comment.whoLikes.indexOf(req.body.userId);
        comment.whoLikes.splice(index, 1);
        comment.like--
        user.like--
      }
      await comment.save()
      await user.save()

      const allComment = await Comment.find()
      res.json(allComment)
    } catch (e) {
      console.log(e, 'err')
    }
})

router.post(
  '/searc-author', async (req, res) => {
    try {
      const posts = await Post.find()

      const fuse = new Fuse(posts, {
        keys: [
          'title',
          'text'
        ]
      })

      const result = fuse.search(req.body.text)

      console.log(posts)
      res.json(result)
    } catch (e) {
      console.log(e, 'err')
    }
})

module.exports = router
