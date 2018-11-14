const axios = require('axios');

exports.addressLookup = async (lat, lng) => {
  let userAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
    process.env.GEOCODING_API
  }`;

  let street;
  let city;
  let state;
  let formattedAddress;

  await axios
    .get(userAddress)
    .then(response => {
      if (response.data.status === 'OK') {
        street = response.data.results[0].address_components[1].long_name;
        neighborHood = response.data.results[0].address_components[2].long_name;
        city = response.data.results[0].address_components[3].long_name;
        state = response.data.results[0].address_components[6].short_name;
        formattedAddress = `${street}, ${city}, ${state}`;
      } else {
        console.log(response.data.status);
      }
    })
    .catch(error => console.log(error));
  return formattedAddress;
};

exports.verifyAddress = async (address, lat, lng) => {
  let userAddress = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
    process.env.GEOCODING_API
  }`;

  let formattedAddress;
  let lookupLat, lookupLng;

  await axios
    .get(userAddress)
    .then(response => {
      if (response.data.status === 'OK') {
        lookupLat = response.data.results[0].geometry.location.lat;
        lookupLng = response.data.results[0].geometry.location.lng;

        if (lat === lookupLat && lng === lookupLng)
          formattedAddress = response.data.results[0].formatted_address;
      } else console.log(response.data.status);
    })
    .catch(error => console.log(error));
  return formattedAddress;
};

exports.neighborhoodLookup = async (lat, lng) => {
  let addressLookup = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
    process.env.GEOCODING_API
  }`;

  let neighborhood;

  await axios
    .get(addressLookup)
    .then(response => {
      if (response.data.status === 'OK') {
        neighborhood = response.data.results[0].address_components[2].long_name;
      } else console.log(response.data.status);
    })
    .catch(error => console.log(error));
  return neighborhood;
};

exports.verifyShovelerAtJobLocation = async (
  listingLat,
  listingLng,
  shovelerLat,
  shovelerlng
) => {
  let distanceLookup = `https://maps.googleapis.com/maps/api/directions/json?origin=${shovelerLat},${shovelerlng}&destination=${listingLat},${listingLng}&key=${
    process.env.MAP_KEY_DEV
  }`;

  let status = false;

  await axios
    .get(distanceLookup)
    .then(response => {
      if (response.data.status === 'OK') {
        let distance = parseFloat(
          response.data.routes[0].legs[0].distance.text.split(' ')[0]
        );
        console.log(response.data.routes[0]);
        console.log(distance);
        if (distance <= 1.2) status = true;
      } else console.error(response.data.status);
    })
    .catch(error => console.error(error));

  return status;
};
