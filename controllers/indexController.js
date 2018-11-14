const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

exports.homepage = async (req, res) => {
  const listings = await Listing.find({ active: true });
  res.render('index', { title: 'Home', listings });
};

exports.howItWorks = (req, res) => {
  //console.log(res.locals.h);
  res.render('howItWorks', { title: 'How It Works' });
};

exports.about = (req, res) => res.render('howItWorks', { title: 'About' });
