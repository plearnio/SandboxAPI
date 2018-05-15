const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./config/database').mongo

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, (err) => {
  if (err) console.log('connect fail')
  else console.log('connect success')
})


const passport = require('passport')
const flash = require('connect-flash')

const app = express()
const PORT = 5000
const HOST = process.env.MODE === 'production' ? '0.0.0.0' : '172.0.0.1'

const authen = require('./routes/authen')

app.use('*', cors({ origin: '*' }))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/authen', authen)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.listen(PORT, HOST, () => {
  console.log(`api server run at port ${PORT} ${HOST}`)
})
