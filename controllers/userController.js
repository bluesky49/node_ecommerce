const mongoose = require('mongoose');
const Shoveler = mongoose.model('Shoveler');
const Shovelee = mongoose.model('Shovelee');
const Listing = mongoose.model('Listing');
const sms = require('../handlers/sms');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('login', {
    title: `Register as a ${
      req.path.startsWith('/register/shoveler') ? 'Shoveler' : 'Shovelee'
    }`
  });
};

exports.validateShovelerRegistration = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must provide a name').notEmpty();
  req.checkBody('email', 'Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req
    .checkBody('password-confirm', 'Confirm Password cannot be blank')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Passwords do not match')
    .equals(req.body.password);
  req.checkBody('phone', 'Phone number cannot be empty').notEmpty();
  //req.checkBody('equipment', 'Equipment is not valid').equals();
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('login', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.validateShoveleeRegistration = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must provide a name').notEmpty();
  req.checkBody('email', 'You must provide an email').notEmpty();
  req.checkBody('phone', 'You must provide a phone number').notEmpty();
  req.checkBody('address', 'You must provide an address').notEmpty();
  req.checkBody('email', 'Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req
    .checkBody('password-confirm', 'Confirm Password cannot be blank')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Passwords do not match')
    .equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('login', {
      title: 'Register as a Shovelee',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

// exports.registerShoveler = async (req, res, next) => {
//   const shoveler = new Shoveler({
//     email: req.body.email,
//     name: req.body.name,
//     phone: req.body.phone,
//     paymentEmail: req.body.email,
//     equipment: req.body.equipment
//   });
//   const register = promisify(Shoveler.register, Shoveler);
//   await register(shoveler, req.body.password);
//   next();
// };

exports.registerShoveler = async (req, res, next) => {
  const shoveler = new Shoveler();
  shoveler.email = req.body.email;
  shoveler.name = req.body.name;
  shoveler.phone = req.body.phone;
  shoveler.paymentEmail = req.body.email;
  shoveler.equipment = req.body.equipment;
  shoveler.password = shoveler.hashPassword(req.body.password);
  shoveler.save(function(err, shoveler) {
    if (err) {
      res.status(500).send('Last Error');
      console.log(err);
    } else {
      req.body.accountType = 'shoveler';
      next();
    }
  });
  // const shoveler = new Shoveler({
  //   email: req.body.email,
  //   name: req.body.name,
  //   phone: req.body.phone,
  //   paymentEmail: req.body.email,
  //   equipment: req.body.equipment
  // });
  // const register = promisify(Shoveler.register, shoveler);
  // await register(shoveler, req.body.password);
  // req.body.accountType = 'shoveler';
  // next();
};

// exports.registerShovelee = async (req, res, next) => {
//   const shovelee = new Shovelee({
//     email: req.body.email,
//     name: req.body.name,
//     phone: req.body.phone,
//     paymentEmail: req.body.email,
//     location: {
//       coordinates: [req.body.lng, req.body.lat],
//       address: req.body.address
//     }
//   });
//   const register = promisify(Shovelee.register, Shovelee);
//   await register(shovelee, req.body.password);
//   req.body.accountType = 'shovelee';
//   next();
// };

exports.registerShovelee = (req, res, next) => {
  Shovelee.findOne({ email: req.body.email }, (err, shovelee) => {
    if (err) {
      res.status(500).send('error occured');
      console.log(err);
    } else {
      if (shovelee) {
        res.status(500).send('User already exists');
      } else {
        let sayed = new Shovelee();
        sayed.email = req.body.email;
        sayed.name = req.body.name;
        sayed.phone = req.body.phone;
        sayed.paymentEmail = req.body.email;
        sayed.location.coordinates = [req.body.lat, req.body.lng];
        sayed.location.address = req.body.address;
        sayed.password = sayed.hashPassword(req.body.password);
        sayed.save(function(err, shovelee) {
          if (err) {
            res.status(500).send('Last Error');
            console.log(err);
          } else {
            req.body.accountType = 'shovelee';
            next();
          }
        });
      }
    }
  });
  // const register = promisify(Shovelee.register, Shovelee);
  // await register(shovelee, req.body.password);
  // req.body.accountType = 'shovelee';
  // next();
};

exports.account = async (req, res) => {
  if (req.user.accountType === 'shovelee') {
    const listings = await Listing.find({ shovelee: req.user._id });
    res.render('account', { title: 'Edit Account', listings });
  } else if (req.user.accountType === 'shoveler') {
    const listings = await Listing.find({ shoveler: req.user._id });
    res.render('account', { title: 'Edit Account', listings });
  }
};

exports.updateAccount = async (req, res) => {
  let updates;
  if (req.params.accountType === 'shoveler') {
    updates = {
      name: req.body.name,
      email: req.body.email,
      paymentEmail: req.body.paypalEmail,
      phone: req.body.phone,
      equipment: req.body.equipment
    };
    const user = await Shoveler.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated Profile');
    sms.accountUpdate(req.body.name, req.body.phone);
  } else if (req.params.accountType === 'shovelee') {
    updates = {
      name: req.body.name,
      email: req.body.email,
      paymentEmail: req.body.paypalEmail,
      phone: req.body.phone,
      location: {
        coordinates: [req.body.lat, req.body.lng],
        address: req.body.address
      }
    };

    const user = await Shovelee.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated Profile');
    sms.accountUpdate(req.body.name, req.body.phone);
  }
  res.redirect('back');
};
