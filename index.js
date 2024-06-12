let cityInput = document.getElementById("city-input");
let searchbtn = document.getElementById("search-button");
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let apiCard = document.querySelectorAll(".highlights .card")[0];
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
  let aqiList = ['Good','Fair','Moderate','Poor','Very Poor']
let fiveDaysForeCastCard = document.querySelector(".day-forecast");
  let humidityVal = document.getElementById("humidityVal")
  let pressureVal = document.getElementById("pressureVal")
  let visibilityVal = document.getElementById("visibilityVal")
  let windSpeedVal = document.getElementById("windSpeedVal")
  let feelsVal = document.getElementById("windSpeedVal")
let ApiKey = "3e6ac8648a9b26b8803ae7715a956e0a";

function getWeatherDetails(name, lat, lon, country, state) {
  let FORCATS_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
  let WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
  let AIR_POLLUTION_API = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  fetch(AIR_POLLUTION_API)
    .then((res) => res.json())
    .then((data) => {
        let {co,no,no2,o3,pm2_5,pm10,nh3,so2}= data.list[0].components;
       
      apiCard.innerHTML = `
    <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi-1]}</p>
              </div>
              <div class="air-indices">
                <i class="fas fa-wind fa-3x"></i>
                <div class="item">
                  <p>PM2.5</p>
                  <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                  <p>PM10</p>
                  <h2>${pm10}</h2>
                </div>
                <div class="item">
                  <p>SO2</p>
                  <h2>${so2}</h2>
                </div>
                <div class="item">
                  <p>CO</p>
                  <h2>${co}</h2>
                </div>
                <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
                </div>
                <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
                </div>
                <div class="item">
                  <p>NH13</p>
                  <h2>${nh3}</h2>
                </div>
                <div class="item">
                  <p>O3</p>
                  <h2>${o3}</h2>
                </div>
              </div> 
   
   `;
    })
    .catch((err) => {
      alert("failed to fetch Air pollution.");
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        let {sunrise,sunset} = data.sys,
        {timezone}= data;
      let date = new Date();
      currentWeatherCard.innerHTML = `
        <div class="current-weather">
          <div class="deatils">
            <p>Now</p>
            <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
            <p>${data.weather[0].description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" alt="weather-pic" />
          </div>
        </div>
        <hr />
        <div class="card-footer">
          <p><i class="fas fa-calendar"></i>${
            days[date.getDay()]
          }, ${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
          <p><i class="fas fa-map-marker-alt"></i>${name}, ${country}</p>
        </div>
      `;
       
        
          let sRiseTime = moment.utc(sunrise * 1000).add(timezone, 'seconds').format('hh:mm A');
          let sSetTime = moment.utc(sunset * 1000).add(timezone, 'seconds').format('hh:mm A');
               sunriseCard.innerHTML = `
                <div class="card-head">
                  <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                  <div class="item">
                    <div class="icon">
                      <i class="fas fa-sun fa-3x"></i>
                    </div>
                    <div>
                      <p>sunrise</p>
                      <h2>${sRiseTime}</h2>
                    </div>
                  </div>
                  <div class="item">
                    <div class="icon">
                      <i class="fas fa-cloud-sun fa-3x"></i>
                    </div>
                    <div>
                      <p>sunset</p>
                      <h2>${sSetTime}</h2>
                    </div>
                  </div>
                </div>
               `

    })
    .catch((err) => {
      alert("Failed to fetch current weather");
    });

  fetch(FORCATS_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let uniqueForecastDays = new Set();
      let fiveDaysForecast = data.list
        .filter((forecast) => {
          let forecastDate = new Date(forecast.dt_txt).getDate();
          if (!uniqueForecastDays.has(forecastDate)) {
            uniqueForecastDays.add(forecastDate);
            return true;
          }
          return false;
        })
        .slice(0, 5);

      fiveDaysForeCastCard.innerHTML = "";

      fiveDaysForecast.forEach((forecast) => {
        let date = new Date(forecast.dt_txt);
        fiveDaysForeCastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrappper">
              <img src="https://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }.png" alt="" />
              <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>
        `;
      });
    })
    .catch((err) => {
      alert("Failed to fetch weather forecast");
    });
}

function getCityCoordinate() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";

  if (!cityName) return;
  let GEOCODIN_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`;
  fetch(GEOCODIN_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch((err) => {
      console.log(err);
    });
}

searchbtn.addEventListener("click", getCityCoordinate);
