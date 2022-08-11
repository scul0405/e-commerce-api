const mongoose = require('mongoose');

const { Schema } = mongoose;

// Admin account we should create in database, don't create by api
// So we don't need password confirm for this model

const adminSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
