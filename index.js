let cityInput = document.getElementById("city-input");
let searchbtn = document.getElementById("search-button");
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let ApiKey = "3e6ac8648a9b26b8803ae7715a956e0a";
function getWeatherDetails(name, lat, lon, country, state) {
  let FORCATS_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
  let WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`;
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
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
        <div class="current-weather">
              <div class="deatils">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg:C</h2>
                <p>${data.weather[0].description}</p>
              </div>
              <div class="weather-icon">
                <img
                  src="https://openweathermap.org/img/wn/${
                    data.weather[0].icon
                  }@2x.png"
                  alt="weather-pic"
                />
              </div>
            </div>
            <hr />
            <div class="card-footer">
              <p><i class="fas fa-calendar"></i>${
                days[date.getDay()]
              },${date.getDate()},${months[date.getMonth()]}</p>
              <p><i class="fas fa-map-marker-alt"></i>${name} ${country}</p>
            </div>
        `;

     
    })
    .catch((err) => {
      alert("Failed to fetch current weather");
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
