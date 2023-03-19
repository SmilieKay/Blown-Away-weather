
let searchInp = document.querySelector('.weather-search');
let city = document.querySelector('.weather-city');
let day = document.querySelector('.weather-day');
let humidity = document.querySelector('.weather-indicator-humidity>.value');
let wind = document.querySelector('.weather-indicator-wind>.value');
let pressure = document.querySelector('.weather-indicator-pressure>.value');
let image = document.querySelector('.weather-image');
let temp = document.querySelector('.weather-temp>.value');
let weatherAPIKey = '2e4914512e314cd0b4ee221b3961702a';
let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + weatherAPIKey;
let weatherForecastEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=' + weatherAPIKey;
let forecastSection = document.querySelector('.weather-forecast');
let searchHistory = document.querySelector('.search-history'); 


let getWeatherByCityName = async (city) => {
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    let weather = await response.json();
    return weather;
};

let getForecastByCityName = async (city) => {
    let endpoint = `${weatherForecastEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    let forecast = await response.json();
    return forecast;
};
const storeSearch = (city) => {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(city)) {
        searches.unshift(city);
        if (searches.length > 5) {
            searches.pop();
        }
        localStorage.setItem('searches', JSON.stringify(searches));
    }
};
const displaySearchHistory = () => {
    searchHistory.innerHTML = '';
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach((search) => {
        let searchItem = document.createElement('div');
        searchItem.classList.add('search-item');
        searchItem.textContent = search;
        searchHistory.appendChild(searchItem);

        searchItem.addEventListener('click', async () => {
            let weather = await getWeatherByCityName(search);
            updateCurrentWeather(weather);

            let forecast = await getForecastByCityName(search);
            updateForecast(forecast);
        });
    });
};

searchInp.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        let cityName = searchInp.value;
        storeSearch(cityName);
        displaySearchHistory();

        let weather = await getWeatherByCityName(cityName);
        updateCurrentWeather(weather);

        let forecast = await getForecastByCityName(cityName);
        updateForecast(forecast);
    }
});


const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
        case '01d': return './images/sunny.png';
        case '01n': return 'images/half-moon.png';
        case '02d': return 'images/cloudy.png';
        case '02n': return 'images/partly-cloudy.png';
        case '03d': return 'images/partly-cloudy.png';
        case '03n': return 'images/night-cloud.png';
        case '04d': return 'images/partly-cloudy.png';
        case '04n': return 'images/night-cloud.png';
        case '09d': return 'images/rain.png';
        case '09n': return 'images/rainy-night.png';
        case '10d': return 'images/rain.png';
        case '10n': return 'images/rainy-night.png';
        case '11d': return 'images/storm.png';
        case '11n': return 'images/storm.png';
        case '13d': return 'images/snow.png';
        case '13n': return 'images/snow.png';
        case '50d': return 'images/foggy.png';
        case '50n': return 'images/foggy.png';
        default: return './images/sunny.png';
    }
};

let updateCurrentWeather = (data) => {
    city.textContent = `${data.name}, ${data.sys.country}`;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;

    let windDirection;
    let deg = data.wind.deg;
    if(deg > 45 && deg <= 135) {
        windDirection = 'East';
    } else if (deg > 135 && deg <= 225) {
        windDirection = 'South';
    
} else if (deg > 225 && deg <= 315) {
    windDirection = 'West';
} else {
    windDirection = 'North';
}
wind.textContent = `${windDirection}, ${data.wind.speed}`;
temp.textContent = data.main.temp < 0 ? '-' + Math.round(data.main.temp) : Math.round(data.main.temp);

let weatherIcon = getWeatherIcon(data.weather[0].icon);
image.src = weatherIcon;
image.alt = data.weather[0].description;
};

let updateForecast = (data) => {
forecastSection.innerHTML = '';
for (let i = 0; i < data.list.length; i += 8) {
    let forecast = data.list[i];
    let forecastElement = document.createElement('div');
    forecastElement.classList.add('weather-forecast-item');

    let forecastDate = new Date(forecast.dt * 1000).toLocaleDateString('en-EN', {
        month: 'short',
        day: 'numeric'
    });
    let forecastTemp = Math.round(forecast.main.temp);
    let forecastIcon = getWeatherIcon(forecast.weather[0].icon);

    forecastElement.innerHTML = `
        <div class="weather-forecast-date">${forecastDate}</div>
        <img src="${forecastIcon}" alt="${forecast.weather[0].description}" class="weather-forecast-icon">
        <div class="weather-forecast-temp">${forecastTemp}&#176;</div>
    `;
    forecastSection.appendChild(forecastElement);
}
};

let dayOfWeek = () => {
return new Date().toLocaleDateString('en-EN', { 'weekday': 'long' });
};

const loadInitialData = async () => {
    const defaultCity = 'New York';
  
    let weather = await getWeatherByCityName(defaultCity);
    updateCurrentWeather(weather);
  
    let forecast = await getForecastByCityName(defaultCity);
    updateForecast(forecast);
  
    displaySearchHistory();
  };

  loadInitialData();