//list of most of the querySelectors used made into variables so the whole thing does not have to be put in the code every time we want to use the items in the class we are selecting 
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
//the weather gets the weather for the day and forecast gets the weather for the 5 day part
const weatherBaseEndpoint = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${weatherAPIKey}`;
const weatherForecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=${weatherAPIKey}`;
const forecastSection = document.querySelector(".forecast");
const searchHistory = document.querySelector(".search-history");

//arrow function named getWeather the async tells the function to pause until the Promise is resolved of rejected. I used this instead of .then() the first await waits for the fetch(endpoint) to finish and then returns the response if the response is ok then the second await waits for the response.json() to finish parsing the JSON data and return the parsed data as a object if the response is not okay then a error message is shown null in this function serves as a way to communicate to the calling code that the operation was not successful, and no valid data is being returned.
const getWeather = async (city) => {
  const endpoint = `${weatherBaseEndpoint}&q=${city}`;
  const response = await fetch(endpoint);

  if (response.ok) {
    const weather = await response.json();
    return weather;
  } else {
    showError("City not found. Please make sure it <br> is spelled correctly or try another city.");
    return null;
  }
};


// the showError function when called by the function getWeather or getForecast selects the styling form class error-message displays the content of the message the setTimeout lets the message display for 40 seconds 
const showError = (message) => {
  const errorMessageContainer = document.querySelector(".error-message");
  errorMessageContainer.innerHTML = message; 
  errorMessageContainer.style.display = "block";

  setTimeout(() => {
    errorMessageContainer.style.display = "none";
  }, 4000);
};


//getForecast function is another async function that is very similar to the getWeather function only this draws in the 5 day forecast and the getWeather draws in the current day forecast 
const getForecast = async (city) => {
  const endpoint = `${weatherForecastEndpoint}&q=${city}`;
  const response = await fetch(endpoint);

  if (response.ok) {
    const forecast = await response.json();
    return forecast;
  } else {
    showError("City not found. Please make sure it <br> is spelled correctly or try another city.");
    return null;
  }
};

//storeSearch takes the parameter of the city you want to search the let part retrieves a array of previous searches from localStorage that is named searches then JSON.parse() converts the retrieved string into a array or if  there is no searches in localStorage then it uses a empty array the if (!searches....) checks to see if the city is already in the array of searches if it is not then the code in braces runs which then unshift adds the city name to the beginning of the list and if (searches.length...) checks to see if the array is longer then 5 items if it is then pop() is called and removes the last item from the array. Then the last part localStorage.setItem... converts the array back into a string and puts it back in localStorage
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

//displaySearchHistory displays the search history. searchHistory.innerHTML clears the searchHistory element to make sure it is empty before adding new content then the JSON.parse gets the string searches from localStorage and makes it into a array or brings up a empty array if the is no searches next the forEach iterates through searches and creates a new div element for each item in the array adds the class search-item to it so that styling applies to it and searchItem.text... sets the content of the element to the city name and appendChild makes it a child element of the search history container 
const displaySearchHistory = () => {
  searchHistory.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((search) => {
    let searchItem = document.createElement("div");
    searchItem.classList.add("search-item");
    searchItem.textContent = search;
    searchHistory.appendChild(searchItem);
  });

  // makes the search history clickable searchHistory.addEventListener("click", async (event) => { ... }); adds a click event listener to the searchHistory element. When a click event occurs inside the searchHistory element, the async is executed, then it is checked to see if the clicked item has the search-item class to make sure the code only runs when the right thing is clicked then the city name of the clicked element is assigned it to the cityName variable next the getWeather function is called with the cityName but since the function is async await allows it to wait for the function to complete and return the data. and updateCurrentWeather(weather); calls the updateCurrentWeather() function with the fetched weather data, which updates the current weather information displayed on the web page the getForecast() function with the cityName as an argument. Similar to the getWeather() updateForecast(forecast); calls the updateForecast() function with the fetched forecast data, which updates the weather forecast displayed on the web page
  searchHistory.addEventListener("click", async (event) => {
    if (event.target.classList.contains("search-item")) {
      let cityName = event.target.textContent;
      let weather = await getWeather(cityName);
      updateCurrentWeather(weather);

      let forecast = await getForecast(cityName);
      updateForecast(forecast);
    }
  });
};
 
//adds an event listener to the searchInp element When a keydown event occurs on the searchInp element, the async function is executed the event object is passed as a argument if (event.key === "Enter") checks to see if the pressed key is enter and if it is allows the code in the braces to run let cityName =... gets the text put in by the user and assigns it to the variable cityName then the getWeather function is called the the variable cityName as its argument and await makes sure the async function is complete then if (weather)... checks if the weather variable ahs a value if it does then storeSearch stores the cityName in localStorage, displaySearchHistory is called which updates the search history updateCurrentWeather updates the current weather displayed and then getForecast is called with the argument cityName  Similar to the getWeather() function, it's asynchronous, and the await keyword is used to wait for the function to complete and return the forecast data updateForecast(forecast); calls the updateForecast() function with the fetched forecast data, which updates the weather forecast displayed on the web page After all the steps inside the if statement are completed, the code proceeds to the next line: searchInp.value = "";. This line clears the search input field by setting its value to an empty string
const addSearchEventListener = () => {
  searchInp.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      let cityName = searchInp.value;

      let weather = await getWeather(cityName);

      if (weather) {
        storeSearch(cityName);
        displaySearchHistory();
        updateCurrentWeather(weather);

        let forecast = await getForecast(cityName);
        updateForecast(forecast);
      }
      searchInp.value = "";
    }
  });
};

//Changes the image displayed it is determined by the icon that is part of the data gotten from the weather api I used switch instead of multi if else statements it compares iconCode with the value of each case and if there is a match then the code is executed aka the picture changes if not the default is sunny. I did go through an assign a image for every icon in the api so it should not go to default
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
  

//Shows the name of the city, the country, the humidity level the high and low temp rounded to a whole number and the wind direction the wind direction uses a if else statement to determine if it is north, south, east or west the next part checks if the the temp is a negative number if it is then a - is put in front of the text for the temp display if not then just the temp is displayed 
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

//forecastSection.innerHTML = ""; clears the content of the forecastSection element then A for loop iterates through the data.list array, which contains forecast data. The loop starts with i = 0 and increments i by 8 at each iteration. This is done because the API returns forecast data for every 3 hours, and we want to display data for every 24 hours (8 intervals of 3 hours forecastDate is calculated then forecastTemp, forecastIcon, forecastHumidity, and forecastWindSpeed are extracted from the forecast object next A new div element called forecastElement is created and assigned the class "forecast-item" and The innerHTML of the forecastElement containing the forecast data lastly The forecastElement is added as a child element, making it visible on the webpage
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


// this loads a default city when the page is first loaded 
const loadInitialData = async () => {
    const defaultCity = "Litchfield";
  
    let weather = await getWeather(defaultCity);
    updateCurrentWeather(weather);
  
    let forecast = await getForecast(defaultCity);
    updateForecast(forecast);
  
    displaySearchHistory();
  };
  
  loadInitialData();
  

displaySearchHistory();
addSearchEventListener();
