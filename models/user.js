const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    select: false,
  },
  confirmPassword: {
    type: String,
    select: false,
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
    default: Date.now(),
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
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// Find only active user
userSchema.pre(/^find/, function (next) {
  this.find({ $ne: { active: false } });
  next();
});

// Hashing password before save : only for create and update, not for save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const hashing = await bcrypt.hash(this.password, 12);
  this.password = hashing;
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew || !this.isModified('password')) next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.isCorrectPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  // create random token
  const resetToken = crypto.randomBytes(45).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires =
    Date.now() + process.env.PASSWORD_RESET_TOKEN_EXPIRES * 60 * 1000; // unit: minute
  // Now this.passwordResetToken was update, and resetToken is the original
  // So we must return resetToken
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
