const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const passport = require('passport')
const flash = require('connect-flash')

const config = require('./config/database').mongo

const app = express()
const PORT = 3000

const authen = require('./routes/authen')

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, (err) => {
  if (err) console.log('connect fail')
  else console.log('connect success')
})

app.use('*', cors({ origin: 'http://localhost:3000' }))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/authen', authen)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.listen(PORT, () => {
  console.log(`ex port ${PORT}`)
})