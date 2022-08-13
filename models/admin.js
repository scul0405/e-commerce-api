const mongoose = require('mongoose');

const { Schema } = mongoose;

// Admin account we should create in database, don't create through api
// So we don't need password confirm for this model

const adminSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: [true, 'Please provide your username'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
  },
});

adminSchema.methods.isCorrectPassword = function (inputPassword, userPassword) {
  return inputPassword === userPassword;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
