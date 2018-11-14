const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const ShoveleeSchema = new mongoose.Schema({
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
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply address coordinates'
      }
    ],
    address: {
      type: String,
      required: 'You must specify address'
    }
  },
  accountType: {
    type: String,
    default: 'shovelee'
  },
  review: {
    type: Number,
    min: 1,
    max: 5
  },
  password: {
    type: String,
    required: 'You must provide a password',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

ShoveleeSchema.methods.hashPassword = function(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

ShoveleeSchema.methods.comparePassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

ShoveleeSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  passwordField: 'password'
});
ShoveleeSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Shovelee', ShoveleeSchema);
