// require mongoose ODM
const mongoose = require('mongoose')

const InProgressGoals = new mongoose.Schema({
  content: {
    type: String
  },
  img_url: {
    type: String
  },
  completed: {
    type: Boolean
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
  inProgressGoals: [InProgressGoals]
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)