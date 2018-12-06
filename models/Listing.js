const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const listingSchema = new Schema({
  shovelee: {
    type: Schema.Types.ObjectId,
    ref: 'Shovelee',
    required: true
  },
  shoveler: {
    type: Schema.Types.ObjectId,
    ref: 'Shoveler'
  },
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title for the shovel job'
  },
  created: {
    type: Date,
    default: Date.now
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
    },
    neighborhood: {
      type: String,
      required: 'Neighborhood must be specified'
    },
    formattedAddress: String
  },
  propertyType: {
    type: String,
    required: 'You must specify property type',
    trim: true,
    lowercase: true,
    enum: [
      'house',
      'building',
      'storefront',
      'complex',
      'vehicle',
      'parkinglot'
    ]
  },
  shovelJob: [
    {
      type: {
        type: String,
        trim: true,
        lowercase: true
      },
      size: {
        type: String,
        required: 'You must specify shovel job size',
        trim: true,
        lowercase: true
      }
    },
    {
      type: {
        type: String,
        trim: true,
        lowercase: true
      },
      size: {
        type: String,
        required: 'You must specify shovel job size',
        trim: true,
        lowercase: true
      }
    },
    {
      type: {
        type: String,
        trim: true,
        lowercase: true
      },
      size: {
        type: String,
        required: 'You must specify shovel job size',
        trim: true,
        lowercase: true
      }
    },
    {
      type: {
        type: String,
        trim: true,
        lowercase: true
      },
      size: {
        type: String,
        required: 'You must specify shovel job size',
        trim: true,
        lowercase: true
      }
    }
  ],
  //   {
  //     type: String,
  //     required: 'You must specify shovel job size',
  //     trim: true,
  //     lowercase: true,
  //     enum: ['small', 'medium', 'large']
  //   }
  // ],
  // shovelJob: {
  //   type: String,
  //   required: 'You must specify shovel job type',
  //   trim: true,
  //   lowercase: true,
  //   enum: ['sidewalk', 'driveway', 'walkway', 'stairs']
  // },
  // size: {
  //   type: String,
  //   required: 'You must specify shovel job size',
  //   trim: true,
  //   lowercase: true,
  //   enum: ['small', 'medium', 'large']
  // },
  snowfall: {
    type: String,
    required: 'You must specify snowfall amount',
    trim: true,
    lowercase: true,
    enum: ['1-12', '13-18', '19']
  },
  active: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    lowercase: true,
    trim: true,
    enum: ['in progress', 'done']
  },
  shovelee_accuracy_review: {
    type: Number,
    min: 1,
    max: 5
  },
  shoveler_timeliness_review: {
    type: Number,
    min: 1,
    max: 5
  },
  shoveler_correspondence_review: {
    type: Number,
    min: 1,
    max: 5
  },
  shoveler_snow_removal_review: {
    type: Number,
    min: 1,
    max: 5
  },
  paymentId: String,
  transactionId: String,
  deadLine: {
    type: Date,
    required: 'You must supply a deadline time'
  },
  price: Number,
  photos: [String]
});

listingSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Listing', listingSchema);
