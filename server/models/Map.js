const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const SubObject = require('./SubObject')
const User = require('./User')

const Schema = mongoose.Schema

const mapSchema = new Schema({
  biome:{type: String , required: true},
  userId:{type: Schema.Types.ObjectId, ref: 'User' },
  size:{type: Number, required: true},
  tilePerArea:{type: Number, required: true},
  mainArea:{type: String},
  area: [{
      subBiome: [{type: String}], // water source, plain 
      objectsInMap: [{
          objectId: {type: Schema.Types.ObjectId, ref: 'SubObject' },
          x:{type: Number, require: true},
          y:{type: Number, require: true},
          itemInSlot: [{
            name:String,
            items:[{type: Schema.Types.ObjectId}]
          }],
          itemInOuput: [{
            name:String,
            items:[{type: Schema.Types.ObjectId}]
          }]
      }],
      animalsInMap: [{
          animalId:{type: Schema.Types.ObjectId},
          x: {type: Number, require: true},
          y: {type: Number, require: true},
          startX: {type: Number, require: true},
          startY: {type: Number, require: true},
        }],
      itemsInMap: [{
          items:[{type: Schema.Types.ObjectId}],
          x: {type: Number, require: true},
          y: {type: Number, require: true},
      }]
  }]
},{timestamps: {createdAt: 'created_timestamp'}})

module.exports = mongoose.model('Map', mapSchema);
