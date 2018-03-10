const express = require('express')
const md5 = require('blueimp-md5')
const cookie = require('cookie')
const mongoose = require('mongoose')

const User = require('../models/User')
const Maps = require('../models/Map')
const SubObject = require('../models/SubObject')
const MainObject = require('../models/MainObject')

const authen = express.Router()
const Userlist = []
const TokenUserList = []
let i = 0

authen.use((req, res, next) => {
  console.log('middleware')
  next()
})

authen.route('/user')
  .get((req, res, next) => {
    console.log(req.headers.authorization, TokenUserList)
      const checkToken = TokenUserList.findIndex((element) => {
        return element == req.headers.authorization
      })
      console.log(checkToken)
      if (checkToken === -1) {
        res.send({ error: 'unauthentication' })
      } else { next() }
    }, (req, res) => {
      res.send(Userlist)
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
      let indexToken
      let timeOut = 0
      const timeNow = Date.now()
      let tokenKey = docs.username + docs.password + timeNow
      let shuffledTokenKey = md5(tokenKey.split('').sort(() => { return 0.5-Math.random()}).join(''))
      console.log(shuffledTokenKey)
      do {
        indexToken = TokenUserList.findIndex((token) => {
          return token === tokenKey
        })
        if (indexToken !== -1) {
          console.log('duplicate')
          shuffledTokenKey = md5(tokenKey.split('').sort(() => { return 0.5-Math.random()}).join(''))
        }
        timeOut += 1
        if(timeOut >= 100) 
        {
          res.send({ error: 'time out'})
          break
        }
      } while (indexToken !== -1)
      const index = Userlist.findIndex((element) => {
        return element.username == docs.username
      })
      console.log(index)
      if(index !== -1) {
        Userlist.splice(index, 1)
        TokenUserList.splice(index, 1)
      }

      Userlist.push(docs)
      TokenUserList.push(shuffledTokenKey)
      res.send({
        user: docs,
        __token: shuffledTokenKey
      })

authen.route('/userdata/:user')
    .get((req, res) => {
      User.findOne({_id:mongoose.Types.ObjectId(req.params.user)}).then((userData)=>{
        if(!userData)
          res.send({error: 'not found'})
        else
          Maps.findOne({userId: userData._id}).then(mapData=>{
            if(!mapData)
              res.send({error: 'not found'})
            else
            {
              mapData.userId = userData
              res.send(mapData)
            }
        })
      }).catch(err =>{
        res.send(err)
      })
    })

authen.route('/map')
    .get((req, res) => {
      Maps.find({}, (err, docs) => {
        res.send(docs)
      })
    })
    .post((req, res) => {
      const newMap = Maps(req.body)
      newMap.save((err, docs) => {
        if (err) res.send('insert error')
        else res.send(docs)
      })
    })

    authen.route('/subob')
    .get((req, res) => {
      SubObject.find({}, (err, docs) => {
        res.send(docs)
      })
    })
    .post((req, res) => {
      const newSubObject = SubObject(req.body)
      newSubObject.save((err, docs) => {
        if (err) res.send('insert error')
        else res.send(docs)
      })
    })

    authen.route('/mainob')
    .get((req, res) => {
      MainObject.find({}, (err, docs) => {
        res.send(docs)
      })
    })
    .post((req, res) => {
      const newMainObject = MainObject(req.body)
      newMainObject.save((err, docs) => {
        if (err) res.send('insert error')
        else res.send(docs)
      })
    })
    }
  })
})

module.exports = authen