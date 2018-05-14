const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const passport = require('passport')
const flash = require('connect-flash')

const config = require('./config/database').mongo

const app = express()
const PORT = 5000 // API

const PORT_SOCKET = 4444
const io = require('socket.io')();

const authen = require('./routes/authen')

const Message = require('./models/Message')

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, (err) => {
  if (err) console.log('connect fail')
  else console.log('connect success')
})

app.use('*', cors({ origin: '*' }))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/authen', authen)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.listen(PORT, () => {
  console.log(`ex port ${PORT}`)
})

const allClient = {}
// const allMessege = []

io.on('connection', (client) => {
  client.on('hello', (data) => {
    allClient[data] = client
    Message.find({}, { _id: 0, updatedAt: 0, created_timestamp: 0 }).then((allMsg) => {
      client.emit('initial_msg', allMsg)
    })
  })

  client.on('messege', (data) => {
    // allMessege.push(data)
    const newMessage = Message(data)
    newMessage.save().then(() => {
      Message.find({}, { _id: 0, updatedAt: 0, created_timestamp: 0 }).then((allMsg) => {
        Object.keys(allClient)
        .forEach((field) => {
          allClient[field].emit('new_messege', allMsg)
        })
      })
    })
    console.log(newMessage)
  })
})

io.listen(PORT_SOCKET)
console.log('Socket listening on port ', PORT_SOCKET)
