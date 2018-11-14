const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const bidSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  shoveler: {
    type: Schema.Types.ObjectId,
    ref: 'Shoveler',
    required: true
  },
  shovelerName: {
    type: String,
    required: 'Shoveler name is required to submit a bid'
  },
  equipment: {
    type: [String],
    required: true
  },
  submitDate: {
    type: Date,
    default: Date.now()
  },
  accepted: {
    type: Boolean,
    default: false
  }
});

bidSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Bid', bidSchema);
