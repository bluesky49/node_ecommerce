import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import mongodbErrorHandler from 'mongoose-mongodb-errors';

const reviewSchema = new mongoose.Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  }
});

reviewSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Review', listingSchema);
