const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    minLength: [6, 'Username must at least 6 characters'],
    unique: true,
    required: [true, 'Please provide your username'],
  },
  password: {
    type: String,
    minLength: [6, 'password must at least 6 characters'],
    required: [true, 'Please provide your password'],
  },
  confirmPassword: {
    type: String,
    selected: false,
    validate: {
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
    },
    required: [true, 'Please provide your confirm password'],
  },
  passwordChangeAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Invalid email'],
    required: [true, 'Please provide your email'],
  },
});

// Find only active user
userSchema.pre(/^find/, function (next) {
  this.find({ $ne: { active: false } });
  next();
});

// Hashing password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const hashing = await bcrypt.hash(this.password, 12);
  this.password = hashing;
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.isCorrectPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
