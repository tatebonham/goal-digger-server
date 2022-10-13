// require mongoose ODM
const mongoose = require('mongoose')

const GoalSchema = new mongoose.Schema({
  content: {
    type: String
  },
  img_url: {
    type: String
  },
  completed: {
    type: Boolean
  }, 
  note: {
    type: String
  }
}, {timestamps: true})

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  goals: [GoalSchema]
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)