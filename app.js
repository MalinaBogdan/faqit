const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const app = express()

app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/post', require('./routes/post.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    const server = app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    server.timeout = 2000;

    process.on('uncaughtException', () => server.close())
    process.on('SIGTERM', () => server.close())
  } catch (e) {
    console.log('Server Error', e.message)
    server.close()
    process.exit(1)
  }
}

start()
