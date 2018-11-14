const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const Shoveler = mongoose.model('Shoveler');
const Shovelee = mongoose.model('Shovelee');

passport.use(
  'shoveler',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      Shoveler.findOne({ email }, function(err, shoveler) {
        if (err) return done(err);
        if (!shoveler) return done(null, false, { message: 'User not found' });
        // shoveler.comparePassword(password, function(err, isMatch) {
        //   if (isMatch) return done(null, shoveler);
        //   else return done(null, false, { message: 'Incorrect Password' });
        // });
        if (!shoveler.comparePassword(password, shoveler.password))
          return done(null, false, { message: 'Incorrect password' });
        return done(null, shoveler);
      });
    }
  )
);

passport.use(
  'shovelee',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      Shovelee.findOne({ email }, function(err, shovelee) {
        if (err) return done(err);
        if (!shovelee) return done(null, false, { message: 'User not found' });
        if (!shovelee.comparePassword(password, shovelee.password))
          return done(null, false, { message: 'Incorrect password' });
        return done(null, shovelee);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  if (isShoveler(user)) {
    return done(null, user.id);
  }

  if (isShovelee(user)) {
    return done(null, user.id);
  }
});

passport.deserializeUser(function(id, done) {
  Shoveler.findById(id, function(err, shoveler) {
    if (err) done(err);
    if (shoveler) done(null, shoveler);
    else {
      Shovelee.findById(id, function(err, shovelee) {
        if (err) done(err);
        done(null, shovelee);
      });
    }
  });
});

async function isShoveler(user) {
  const search = await Shoveler.countDocuments({ _id: user._id });
  if (search > 0) return true;
  else return false;
}

async function isShovelee(user) {
  const search = await Shovelee.countDocuments({ _id: user._id });
  if (search > 0) return true;
  else return false;
}
