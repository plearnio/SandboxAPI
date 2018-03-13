const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const SubObject = require('./SubObject')
const User = require('./User')

const Schema = mongoose.Schema

const mapSchema = new Schema({
  biome:{type: String , required: true},
  userId:{type: Schema.Types.ObjectId, ref: 'User' },
  width:{type: Number, required: true},
  height:{type: Number, required: true},
  tilePerArea:{type: Number, required: true},
  mainArea:{type: Number},
  area: [{
      subBiome: [{type: String}], // water source, plain 
      objectsInMap: [{
          objectId: {type: Schema.Types.ObjectId, ref: 'SubObject' },
          x:{type: Number, require: true},
          y:{type: Number, require: true},
          itemInSlot: [{
            name:String,
            items:Schema.Types.Array
          }],
          itemInOuput: [{
            name:String,
            items:Schema.Types.Array
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
          items:Schema.Types.Array,
          x: {type: Number, require: true},
          y: {type: Number, require: true},
      }]
  }]
},{timestamps: {createdAt: 'created_timestamp'}})

module.exports = mongoose.model('Map', mapSchema);
