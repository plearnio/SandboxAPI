const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const Schema = mongoose.Schema

const messageSchema = new Schema({
  name: { type: String },
  msg: { type: String }
}, {
  timestamps: { createdAt: 'created_timestamp' }
})

module.exports = mongoose.model('Message', messageSchema);
