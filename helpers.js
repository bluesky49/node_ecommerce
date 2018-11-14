const fs = require('fs');
exports.moment = require('moment');
exports.dump = obj => JSON.stringify(obj, null, 2);
exports.capitalize = str => {
  return str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
};
exports.isObjEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

exports.siteName = 'ShovelPros';
exports.menu = [
  { slug: '/about', title: 'About' },
  { slug: '/how-it-works', title: 'How It Works' }
];
