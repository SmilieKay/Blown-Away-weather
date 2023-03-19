let searchInp = document.querySelector('.weather-search');
let city = document.querySelector('.weather-city');
let day = document.querySelector('.weather-day');
let humidity = document.querySelector('.weather-indicator-humidity>.value');
let wind = document.querySelector('.weather-indicator-wind>.value');
let pressure = document.querySelector('.weather-indicator-pressure>.value');
let image = document.querySelector('.weather-image');
let temp = document.querySelector('.weather-temp>.value');
let weatherAPIKey = '2e4914512e314cd0b4ee221b3961702a';
let weatherBaseEndpoint ='https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + weatherAPIKey;



// endpoint takes the var weatherBaseEndpoint and adds &q= and city the end of it to call by city await fetch(endpoint) tells it to wait for a response async is used to declare the getWeatherByCityName function as asynchronous. This means that the function will return a promise that will resolve with the return value of the function, or reject with an error if an error occurs
let getWeatherByCityName = async (city) => {
    let endpoint = `${weatherBaseEndpoint}&q=${city}`;
    let response = await fetch(endpoint);
    let weather = await response.json();
 return weather;   
}
   

// adds a eventListener for the search bar the keyCode for the Enter key shows as 13 in console.log 
searchInp.addEventListener('keydown', async(event) => {
if(event.keyCode === 13){
    let weather = await getWeatherByCityName(searchInp.value);
    updateCurrentWeather(weather);
}
})

// changes the name of the city displayed data.name fetches the info from the API info we called
let updateCurrentWeather = (data) => {
    console.log(data)
city.textContent = `${data.name}, ${data.sys.country}`;
day.textContent = dayOfWeek()
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
}

let dayOfWeek = () => {
    return new Date().toLocaleDateString('en-EN',{'weekday': 'long'})
}