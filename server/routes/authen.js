const express = require('express')
const cookie = require('cookie')
const User = require('../models/User')
const md5 = require('blueimp-md5')
const authen = express.Router()
const Userlist = []
const TokenUserList = []
let i = 0

authen.use((req, res, next) => {
  console.log('middleware')
  next()
})

authen.route('/users')
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

authen.route('/users/:id')
  .get((req, res, next) => {
    console.log(req.headers.authorization, TokenUserList)
      const checkToken = TokenUserList.findIndex((element) => {
        return element == req.headers.authorization
      })
      if (checkToken === -1) {
        res.send({ error: 'no permission' })
      } else { 
        req.tokenIndex = checkToken
        next() }
    }, (req, res) => {
      console.log(`user's token is at ${req.tokenIndex}`)
      res.send(Userlist[req.tokenIndex])
    })

authen.route('/logout')
.get((req, res, next) => {
  console.log(req.headers.authorization, TokenUserList)
    const checkToken = TokenUserList.findIndex((element) => {
      return element == req.headers.authorization
    })
    if (checkToken === -1) {
      res.send({ error: 'no permission' })
    } else { 
      req.tokenIndex = checkToken
      next() }
  }, (req, res) => {
    Userlist.splice(req.tokenIndex, 1)
    TokenUserList.splice(req.tokenIndex, 1)
    res.send({ status: 'complete' })
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
    }
  })
})

module.exports = authen