const passport = require('passport');
const mongoose = require('mongoose');
const Shoveler = mongoose.model('Shoveler');
const Shovelee = mongoose.model('Shovelee');
const crypto = require('crypto');
const mail = require('../handlers/mail');

exports.loginShovelee = passport.authenticate('shovelee', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/account',
  successFlash: 'Successfully Logged In'
});

exports.loginShoveler = passport.authenticate('shoveler', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/account',
  successFlash: 'Successfully Logged In'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
};

exports.isShoveler = (req, res, next) => {
  if (req.user.accountType === 'shoveler') {
    return next();
  }
  req.flash('error', 'You cannot access this page.');
  res.redirect('back');
};

exports.isShovelee = (req, res, next) => {
  if (req.user.accountType === 'shovelee') {
    return next();
  }
  req.flash('error', 'You cannot access this page.');
  res.redirect('back');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page');
  res.redirect('/login');
};

exports.notOnDuty = async (req, res, next) => {
  if (req.user.onDuty === false) return next();
  req.flash(
    'error',
    'You must finish current jobs in progress before accepting a new one'
  );
  res.redirect('/listing/in-progress');
};

exports.hasEquipment = (req, res, next) => {
  if (req.user.equipment.length >= 1) return next();
  req.flash(
    'error',
    'You must have at least one ore more equipment(s) checked on your profile in order to see jobs available'
  );
  res.redirect('/account');
};

exports.forgot = async (req, res) => {
  if (req.body.accountType === 'shoveler') {
    let user = await Shoveler.findOne({ email: req.body.email });
    if (!user) {
      req.flash(
        'error',
        'Reset email sent if there was an email found under this address'
      );
      return res.redirect(`/login`);
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 36000000;
    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${
      req.body.accountType
    }/${user.resetPasswordToken}`;

    await mail.send({
      user,
      filename: 'password-reset',
      subject: 'Password Reset',
      resetURL
    });
    req.flash('success', `You have been emailed a password reset link.`);
    res.redirect(`/login`);
  } else if (req.body.accountType === 'shovelee') {
    let user = await Shovelee.findOne({ email: req.body.email });
    if (!user) {
      req.flash(
        'error',
        'Reset email sent if there was an email found under this address'
      );
      return res.redirect(`/login`);
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 36000000;
    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${
      req.body.accountType
    }/${user.resetPasswordToken}`;

    await mail.send({
      user,
      filename: 'password-reset',
      subject: 'Password Reset',
      resetURL
    });
    req.flash('success', `You have been emailed a password reset link.`);
    res.redirect(`/login`);
  }
};

exports.reset = async (req, res) => {
  if (req.params.accountType === 'shoveler') {
    const user = await Shoveler.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect(`/login`);
    }

    res.render('reset', { title: 'Reset your password' });
  } else if (req.params.accountType === 'shovelee') {
    const user = await Shovelee.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect(`/login`);
    }

    res.render('reset', { title: 'Reset your password' });
  }
};

exports.resetInternally = async (req, res) => {
  const currentPassword = req.body.currentPassword;
  if (req.params.accountType === 'shoveler') {
    const user = await Shoveler.findById({ _id: req.user._id });
    if (user.comparePassword(currentPassword, user.password)) {
      user.password = user.hashPassword(req.body.password);
      await user.save();
      req.flash('success', 'Password was reset successfully');
      res.redirect('/account');
    } else {
      req.flash('error', 'Current password is incorrect');
      res.redirect('/account');
    }
  } else if (req.params.accountType === 'shovelee') {
    const user = await Shovelee.findById({ _id: req.user._id });
    if (user.comparePassword(currentPassword, user.password)) {
      user.password = user.hashPassword(req.body.password);
      await user.save();
      req.flash('success', 'Password was reset successfully');
      res.redirect('/account');
    } else {
      req.flash('error', 'Current password is incorrect');
      res.redirect('/account');
    }
  }
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    return next();
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
};

exports.update = async (req, res) => {
  if (req.params.accountType === 'shoveler') {
    const user = await Shoveler.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect(`/login`);
    }

    user.password = user.hashPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Password was reset successfully!');
    res.redirect('/');
  } else if (req.params.accountType === 'shovelee') {
    const user = await Shovelee.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect(`/login`);
    }

    user.password = user.hashPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Password was reset successfully!');
    res.redirect('/');
  }
};
