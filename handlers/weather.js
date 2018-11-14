const axios = require('axios');

exports.getWeather = async (lat, lng) => {
  const weatherRequest = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lng}&units=imperial&appid=${
    process.env.OPEN_WEATHER
  }`;

  let weather = {};

  await axios
    .get(weatherRequest)
    .then(response => {
      if (response.data.cod === '200') {
        weather.temp = parseInt(response.data.list[0].main.temp);
        weather.wind = parseInt(response.data.list[0].wind.speed);
        weather.snow = response.data.list[0].snow;
        weather.title = response.data.list[0].weather[0].main;
        weather.description = response.data.list[0].weather[0].description;
        weather.icon = response.data.list[0].weather[0].icon;
      } else {
        console.log(response.data.cod);
      }
    })
    .catch(error => console.log(error));
  return weather;
};
