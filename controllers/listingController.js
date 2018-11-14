const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const Shoveler = mongoose.model('Shoveler');
const Shovelee = mongoose.model('Shovelee');
const Bid = mongoose.model('Bid');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const sms = require('../handlers/sms');
const geocoding = require('../handlers/geocoding');
const weather = require('../handlers/weather');
const moment = require('moment');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'This file type is not allowed' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.jobsInProgress = async (req, res) => {
  const listings = await Listing.find({
    shoveler: req.user._id,
    status: 'in progress'
  });
  res.render('listingJobs', { title: 'Jobs in progress', listings });
};

exports.availableJobs = (req, res) => {
  res.render('listingJobs', { title: 'Available Jobs near you' });
};

exports.listingForm = (req, res) => {
  res.render('addListing', { title: 'Add Shovel Job' });
};

exports.validateListing = async (req, res, next) => {
  // Not empty inputs
  req.checkBody('propertyType', 'Property type must be selected').notEmpty();
  req
    .check('propertyType')
    .isIn([
      'house',
      'building',
      'storefront',
      'complex',
      'vehicle',
      'parkinglot'
    ])
    .withMessage('Property Type is not supported');
  req
    .checkBody(
      'snowfall',
      'Snowfall amount must be specified to provide accurate pricing'
    )
    .notEmpty();
  req
    .check('snowfall')
    .isIn(['1-12', '13-18', '19'])
    .withMessage('Snowfall amount is not in range');
  req.checkBody('shovelJob', 'Shovel Job type must be specified').notEmpty();
  req
    .check('shovelJob')
    .isIn(['sidewalk', 'driveway', 'walkway', 'stairs'])
    .withMessage('Shovel Job is not supported');
  req.checkBody('jobSize', 'Job size must be specified').notEmpty();
  req
    .check('jobSize')
    .isIn(['small', 'medium', 'large'])
    .withMessage('Job Size is not valid');
  req.checkBody('deadline', 'Deadline must be specified').notEmpty();
  req
    .check('deadline')
    .isAfter(
      moment()
        .add(2, 'hour')
        .format('YYYY-MM-DDThh:mm')
    )
    .isBefore(
      moment()
        .add(2, 'days')
        .format('YYYY-MM-DDThh:mm')
    )
    .withMessage('Deadline is out of range');
  req.checkBody('address', 'Address must be specified').notEmpty();
  req.checkBody('lat', 'Latitude cannot be empty').notEmpty();
  req.checkBody('lng', 'Longitude cannot be empty').notEmpty();
  req
    .check('address')
    .contains(
      await geocoding.verifyAddress(
        req.body.address,
        req.body.lat,
        req.body.lng
      )
    )
    .withMessage('Address is invalid');

  // Validate all inputs before moving to next function
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('addListing', {
      title: 'Add Shovel Job',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.validateShovelerLocation = (req, res, next) => {
  if (req.body.lat && req.body.lng) next();
  else {
    req.flash('error', 'Location was not found');
    res.redirect('back');
  }
};

exports.validateShovelerLocationWithListingLocation = async (
  req,
  res,
  next
) => {
  const listing = await Listing.findById(req.params.id);
  const shovelerLocationVerify = await geocoding.verifyShovelerAtJobLocation(
    listing.location.coordinates[0],
    listing.location.coordinates[1],
    req.body.lat,
    req.body.lng
  );
  console.log('Shoveler LAT:' + req.body.lat);
  console.log('Shoveler LNG:' + req.body.lng);
  if (shovelerLocationVerify) next();
  else {
    req.flash('error', 'You are outside of the job location zone.');
    res.redirect('back');
  }
};

exports.validateShovelerRating = (req, res, next) => {
  req.checkBody('shoveleeRating', 'Rating must be specified').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.redirect('back');
    return;
  }
  next();
};

exports.jobsByNeighborhood = async (req, res) => {
  const userNeighborhood = await geocoding.neighborhoodLookup(
    req.body.lat,
    req.body.lng
  );

  let listings = await Listing.find({
    'location.neighborhood': userNeighborhood,
    active: true
  });

  res.render('listingJobs', { title: 'Available Jobs near you', listings });
};

exports.createListing = async (req, res, next) => {
  const listing = new Listing({
    shovelee: req.user._id,
    title: `${res.locals.h.capitalize(
      req.body.propertyType
    )} | ${res.locals.h.capitalize(req.body.shovelJob)} | ${
      req.body.snowfall
    }"`,
    location: {
      address: req.body.address,
      formattedAddress: await geocoding.addressLookup(
        req.body.lat,
        req.body.lng
      ),
      neighborhood: await geocoding.neighborhoodLookup(
        req.body.lat,
        req.body.lng
      ),
      coordinates: [req.body.lat, req.body.lng]
    },
    propertyType: req.body.propertyType,
    shovelJob: req.body.shovelJob,
    size: req.body.jobSize,
    snowfall: req.body.snowfall,
    deadLine: new Date(req.body.deadline),
    price: parseFloat(req.body.listingPrice)
  });
  await listing.save();
  req.listingId = listing._id;
  req.listingPrice = parseFloat(req.body.listingPrice);
  req.listingFee = parseFloat(
    ((10.5 / 100) * req.listingPrice + 0.3).toPrecision(2)
  );
  req.listingTotal = req.listingPrice + req.listingFee;
  next();
};

exports.listingDetails = async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id });
  const bids = await Bid.find({ listing: listing._id });
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/');
  } else {
    const formattedAddress = await geocoding.addressLookup(
      listing.location.coordinates[0],
      listing.location.coordinates[1]
    );
    const weatherData = await weather.getWeather(
      listing.location.coordinates[0],
      listing.location.coordinates[1]
    );
    res.render('listing', {
      title: listing.title,
      address: formattedAddress,
      listing,
      bids,
      weatherData
    });
  }
};

exports.acceptJob = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const shovelee = await Shovelee.findById(listing.shovelee);
  const shoveler = await Shoveler.findById(req.user._id);
  shoveler.onDuty = true;
  await shoveler.save();

  // Assign shoveler id to the listing
  listing.shoveler = req.user._id;
  // Deactivate listing to not be shown to other shovelers
  listing.active = false;
  // Change status of the listing
  listing.status = 'in progress';
  await listing.save();

  // Text shovelee with an update
  sms.shovelerAssigned(shovelee.name, req.user.name, shovelee.phone);

  // Show job in the jobs in progress page
  res.redirect('/listing/in-progress');
};

exports.createBid = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const shovelee = await Shovelee.findById(listing.shovelee);
  const bidCheck = await Bid.findOne({
    listing: listing,
    shoveler: req.user._id
  });
  if (bidCheck) {
    req.flash('error', 'You have already submitted a bid for this job.');
    res.redirect('/');
  } else {
    const bid = new Bid({
      listing: req.params.id,
      shoveler: req.user._id,
      shovelerName: req.user.name,
      equipment: req.user.equipment
    });

    await bid.save();
    sms.newBid(
      shovelee.name,
      req.user.name,
      shovelee.phone,
      `${req.protocol}://${req.get('host')}/listing/${listing._id}`
    );
    req.flash(
      'success',
      'Your bid was made successfully. Keep an eye out for a message on the status of the bid'
    );
    res.redirect(`/listing/${listing._id}`);
  }
};

exports.acceptBid = async (req, res) => {
  const bid = await Bid.findById(req.body.bidId);
  if (bid) {
    const listing = await Listing.findById(bid.listing);
    bid.accepted = true;
    listing.shoveler = bid.shoveler;
    listing.active = false;
    listing.status = 'in progress';
    await listing.save();
    await bid.save();
    req.flash(
      'success',
      'Thanks for accepting the bid. A ShovelPro will be on the way soon!'
    );
    res.redirect(`/listing/${req.params.id}`);
  } else {
    req.flash('error', 'Unable to find Bid.');
    res.redirect('back');
  }
};

exports.completeJob = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (listing) {
    listing.status = 'done';
    listing.shovelee_accuracy_review = req.body.shoveleeRating;
    const shoveler = await Shoveler.findById(req.user._id);
    shoveler.onDuty = false;
    await shoveler.save();
    // await Shoveler.findOneAndUpdate(req.user._id, { onDuty: false }).exec();
    const shovelee = await Shovelee.findById(listing.shovelee);

    await listing.save();
    sms.jobCompleted(
      listing.title,
      shovelee.name,
      req.user.name,
      shovelee.phone
    );
    req.listingId = listing._id;
    req.listingPrice = listing.price;

    next();
  } else {
    req.flash('error', 'Could not find listing in our records.');
    res.redirect('back');
  }
};
