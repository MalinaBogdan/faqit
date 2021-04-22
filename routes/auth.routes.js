const { Router } = require('express')
const express = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const path = require("path");
const multer = require("multer");
const moment = require('moment')
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "faqit",
  api_key: "712722147356543",
  api_secret: "9Mq3DUn_v1vlAyaMCVY0wtXqjjw"
})

const cloudinaryUpload = file => cloudinary.uploader.upload(file);

const formatBufferTo64 = file =>
  parser.format(path.extname(file.originalname).toString(), file.buffer)

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, fileFilter: fileFilter, inMemory: true })

router.post('/upload', upload.single('myImage'), async (req, res) => {
  try {
    const file64 = formatBufferTo64(req.file);
    const uploadResult = await cloudinaryUpload(file64.content);
    return res.json(uploadResult.url);
    } catch (error) {
        console.error(error);
    }
})

// /api/auth/register
router.post(
  '/register',
  // [
  //   check('login', 'Некорректный login'),
  //   check('password', 'Минимальная длина пароля 6 символов')
  //     .isLength({ min: 6 }),
  //   check('email').isEmail().normalizeEmail()
  // ],
  async (req, res) => {
    try {
    // const errors = validationResult(req)

    // if (!errors.isEmpty()) {
    //   res.status(400).json({
    //     // errors: errors.array(),
    //     message: 'invalid ' +  errors[0].param
    //   })
    // }

    const { login, password, email, avatar } = req.body
    const candidate = await User.findOne({ login })

    if (candidate) {
      return res.status(400).json({ message: 'Login is already use' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
        login, password: hashedPassword, like: 0, email,
        avatar: !!avatar ? avatar : "https://res.cloudinary.com/faqit/image/upload/v1618841792/ammm7gjtfgyj0dp0ykpe_g5zbll.jpg"
    })

    await user.save()
      
    res.json({ message: "User create" })

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again', e })
  }
})

// /api/auth/login
router.post(
  '/login',
  async (req, res) => {
  try {
    const { login, password } = req.body

    const user = await User.findOne({ login })

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })
      res.json({ token, userId: user.id })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.post(
  '/info', async (req, res) => {
    try {
      const user = await User.findOne({_id: req.body.id})
      res.json(user)
    } catch (e) {
      console.log(e, 'err')
    }
})

module.exports = router
