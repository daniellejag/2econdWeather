function formatDate(timestamp) {
  let date = new Date(timestamp);
  let currentTime = "AM";

   let hours = date.getHours();
  if (hours > 12) {
    hours = hours - 12;
    currentTime = "PM"
  }
  

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

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
    "Dec"
  ];
  

  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();
  let currentYear = date.getFullYear();
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes} ${currentTime} <br> ${currentMonth} ${currentDate}, ${currentYear}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
let forecast = response.data.daily; 

  let forecastElement = document.querySelector("#forecast");

let forecastHTML = `<div class="row">`;
forecast.forEach(function (forecastDay, index) {
  if (index < 6) {
forecastHTML = forecastHTML +
`
            <div class="col-2">
              <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
              <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
              alt=""
              width="50"
              />
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-temperature-max">  ${Math.round(forecastDay.temp.max)}º </span>
                <span class="weather-forecast-temperature-min">  ${Math.round(forecastDay.temp.min)}º </span>
              </div>
                </div>
                
                `;
  }
});
                forecastHTML = forecastHTML + `</div>`;
                forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "b3a8312e8813d91f8ac0edd65adaa9c3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}



function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");


  fahrenheitTemperature = response.data.main.temp;

  
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
 
  
  getForecast(response.data.coord);
}



function search(city) {
  let apiKey = "b3a8312e8813d91f8ac0edd65adaa9c3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
   let displayPlanet = document.querySelector("#planet");
  search(cityInputElement.value)
   displayPlanet.innerHTML = ` Earth 📍`;
}


function displayCelsiusTemperature(event) {
  event.preventDefault();
   let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let celsiusTemperature = (fahrenheitTemperature - 32) *  5/9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  
}

function displayFahrenheitTemperature(event) {
 event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function getLocation(position) {
  let apiKey = "b3a8312e8813d91f8ac0edd65adaa9c3";
  let unit = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${apiKey}`;
 celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  axios.get(apiURL).then(showTemperature);
}



let currentLocationButton = document.querySelector("#current-city-btn");
currentLocationButton.addEventListener("click", getPosition);
function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let displayPlanet = document.querySelector("#planet");

  currentCity.innerHTML = response.data.name
 displayPlanet.innerHTML = ` Earth 📍`;

  temperatureElement.innerHTML = temperature;
}


let fahrenheitTemperature = null;


let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);


let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);



search("Barcelona");
