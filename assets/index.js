

const searchInp = document.querySelector(".search-bar");
const city = document.querySelector(".city");
const currentDay = document.querySelector(".current-day");
const humidity = document.querySelector(".humidity>.value");
const wind = document.querySelector(".wind>.value");
const tempHigh = document.querySelector(".temp-high>.value");
const tempLow = document.querySelector(".temp-low>.value");
const image = document.querySelector(".image");
const temp = document.querySelector(".temp>.value");
const weatherAPIKey = "2e4914512e314cd0b4ee221b3961702a";
const weatherBaseEndpoint = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${weatherAPIKey}`;
const weatherForecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=${weatherAPIKey}`;
const forecastSection = document.querySelector(".forecast");
const searchHistory = document.querySelector(".search-history");

const getWeatherByCityName = async (city) => {
  const endpoint = `${weatherBaseEndpoint}&q=${city}`;
  const response = await fetch(endpoint);

  if (response.ok) {
    const weather = await response.json();
    return weather;
  } else {
    showError("City not found. Please try another city.");
    return null;
  }
};

const showError = (message) => {
  const errorMessageContainer = document.querySelector(".error-message");
  errorMessageContainer.textContent = message;
  errorMessageContainer.style.display = "block";

  setTimeout(() => {
    errorMessageContainer.style.display = "none";
  }, 3000);
};

const getForecastByCityName = async (city) => {
  const endpoint = `${weatherForecastEndpoint}&q=${city}`;
  const response = await fetch(endpoint);

  if (response.ok) {
    const forecast = await response.json();
    return forecast;
  } else {
    showError("City not found. Please try another city.");
    return null;
  }
};

const storeSearch = (city) => {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(city)) {
    searches.unshift(city);
    if (searches.length > 5) {
      searches.pop();
    }
    localStorage.setItem("searches", JSON.stringify(searches));
  }
};

const displaySearchHistory = () => {
  searchHistory.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((search) => {
    let searchItem = document.createElement("div");
    searchItem.classList.add("search-item");
    searchItem.textContent = search;
    searchHistory.appendChild(searchItem);
  });

  searchHistory.addEventListener("click", async (event) => {
    if (event.target.classList.contains("search-item")) {
      let cityName = event.target.textContent;
      let weather = await getWeatherByCityName(cityName);
      updateCurrentWeather(weather);

      let forecast = await getForecastByCityName(cityName);
      updateForecast(forecast);
    }
  });
};

const addSearchEventListener = () => {
  searchInp.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      let cityName = searchInp.value;

      let weather = await getWeatherByCityName(cityName);

      if (weather) {
        storeSearch(cityName);
        displaySearchHistory();
        updateCurrentWeather(weather);

        let forecast = await getForecastByCityName(cityName);
        updateForecast(forecast);
      }
      // Clear the search input after processing the search
      searchInp.value = "";
    }
  });
};

const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
        return "./images/sunny.png";
      case "01n":
        return "images/half-moon.png";
      case "02d":
        return "images/cloudy.png";
      case "02n":
        return "images/partly-cloudy.png";
      case "03d":
        return "images/partly-cloudy.png";
      case "03n":
        return "images/night-cloud.png";
      case "04d":
        return "images/partly-cloudy.png";
      case "04n":
        return "images/night-cloud.png";
      case "09d":
        return "images/rain.png";
      case "09n":
        return "images/rainy-night.png";
      case "10d":
        return "images/rain.png";
      case "10n":
        return "images/rainy-night.png";
      case "11d":
        return "images/storm.png";
      case "11n":
        return "images/storm.png";
      case "13d":
        return "images/snow.png";
      case "13n":
        return "images/snow.png";
      case "50d":
        return "images/foggy.png";
      case "50n":
        return "images/foggy.png";
      default:
        return "./images/sunny.png";
    }
  };
  


const updateCurrentWeather = (data, forecastData) => {
  city.textContent = `${data.name}, ${data.sys.country}`;
  humidity.textContent = `Humidity: ${data.main.humidity}`;
  tempHigh.textContent = Math.round(data.main.temp_max);
  tempLow.textContent = Math.round(data.main.temp_min);

  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  wind.textContent = `Wind: ${windDirection}, ${data.wind.speed}`;
  temp.textContent =
    data.main.temp < 0
      ? "-" + Math.round(data.main.temp)
      : Math.round(data.main.temp);

  let weatherIcon = getWeatherIcon(data.weather[0].icon);
  image.src = weatherIcon;
  image.alt = data.weather[0].description;
  //sets current day
  currentDay.textContent = new Date().toLocaleDateString('en-US',{ weekday: 'long'});
};

const updateForecast = (data) => {
  forecastSection.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    let forecast = data.list[i];
    let forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    let forecastDate = new Date(forecast.dt * 1000).toLocaleDateString(
      "en-EN",
      {
        month: "short",
        day: "numeric",
      }
    );
    let forecastTemp = Math.round(forecast.main.temp);
    let forecastIcon = getWeatherIcon(forecast.weather[0].icon);
    let forecastHumidity = forecast.main.humidity;
    let forecastWindSpeed = forecast.wind.speed;

    forecastElement.innerHTML = `
        <div class="weather-forecast-date">${forecastDate}</div>
        <img src="${forecastIcon}" alt="${forecast.weather[0].description}" class="icon">
        <div class="weather-forecast-temp">${forecastTemp}&#176;</div>
        <div class="weather-forecast-h
        -humidity">Humidity: ${forecastHumidity}%</div>
        <div class="weather-forecast-wind">Wind: ${forecastWindSpeed} mph</div>
    `;

    forecastSection.appendChild(forecastElement);
  }
};



const loadInitialData = async () => {
    const defaultCity = "Litchfield";
  
    let weather = await getWeatherByCityName(defaultCity);
    updateCurrentWeather(weather);
  
    let forecast = await getForecastByCityName(defaultCity);
    updateForecast(forecast);
  
    displaySearchHistory();
  };
  
  loadInitialData();
  

displaySearchHistory();
addSearchEventListener();
