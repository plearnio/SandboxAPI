const express = require('express')
const User = require('../models/User')

const authen = express.Router()
var Userlist = []
var i = 0

authen.use((req, res, next) => {
  if (i>0)
  {
    const check = Userlist.find((element) => {
      return element.username == req.body.username
    })
    if(check)
    res.send("already in system")
  }
  else
  next()
})

authen.route('/')
  .get((req, res) => {
    User.find({}, (err, docs) => {
      res.send(docs)
    })
  })
  .post((req, res) => {
    const newUser = User(req.body)
    newUser.save((err, docs) => {
      if (err) res.send('insert error')
      else res.send(docs)
    })
  })

authen.route('/login')
.post((req, res) => {
  User.findOne({username: req.body.username ,password: req.body.password}, (err, docs) =>{
    if (err)
    res.send("error")
    if (!docs)
    res.send("wrong user or password")
    else
    {
      Userlist.push(docs)
      res.send([docs, Userlist])
      i++
    }
  })
})

module.exports = authen
