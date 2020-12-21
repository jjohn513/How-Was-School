const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    subject: String,
    description: String
  })
  
  module.exports = mongoose.model('users', userSchema)