const io = require('socket.io')()
const mongoose = require('mongoose')
const cors = require('cors')

const config = require('./config/database').mongo

const PORT_SOCKET = 4444

mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`, (err) => {
  if (err) {
    console.log(err)
    console.log('connect fail')
  }
  else console.log('connect success')
})

const Message = require('./models/Message')

const allClient = {}
const allMessege = []

io.on('connection', (client) => {
  client.on('hello', (data) => {
    allClient[data] = client
    Message.find({}, { _id: 0, updatedAt: 0, created_timestamp: 0 }).then((allMsg) => {
      client.emit('initial_msg', allMsg)
    })
  })

  client.on('messege', (data) => {
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