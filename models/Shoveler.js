const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const shovelerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    required: 'Please provide a name',
    trim: true
  },
  phone: {
    type: String,
    required: 'You must provide a phone number',
    trim: true,
    maxlength: [17, 'Please provide a valid phone number'],
    minlength: [17, 'Please provide a valid phone number']
  },
  paymentEmail: {
    type: String,
    unique: true,
    required: 'You must provide your PayPal email address for payouts',
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },
  equipment: {
    type: [String],
    required: 'Please specify equipment',
    trim: true,
    lowercase: true,
    enum: ['bobcat', 'snow brush/scraper', 'shovel', 'snow blower', 'snow plow']
  },
  accountType: {
    type: String,
    default: 'shoveler'
  },
  onDuty: Boolean,
  password: {
    type: String,
    required: 'You must provide a password',
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

shovelerSchema.methods.hashPassword = function(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

shovelerSchema.methods.comparePassword = function(pass, hash) {
  return bcrypt.compareSync(pass, hash);
};

shovelerSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  passwordField: 'password'
});
shovelerSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Shoveler', shovelerSchema);
