var formEL = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#cityName");
var weatherContainer = document.querySelector("#weatherContainer");
var fiveDayContainer = document.querySelector("#five-day-container");

var cityHistory = [];
var key = "81cd2e654678051d45857f59eb22e144"


var cityDetails = document.createElement("div");
cityDetails.classList = "col-12 border rounded px-3 py-3  align-self-end"

var submitHandler = function() {
    event.preventDefault();
    console.log(event);

    var cityName = nameInputEl.value.trim();
    //  nameInputEl = "";

    if (cityName) {
        getUserInput(cityName);
        // forecast(cityName);
        nameInputEl.value = "";

    } else {
        alert("please enter valid city name");
    }

}


var getUserInput = function(input) {
    console.log(input);

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" +
        input +
        "&units=imperial&appid=81cd2e654678051d45857f59eb22e144";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {

                        currentWeather(data);

                    })
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()`
            alert("Unable to connect");
        });

    if (!cityHistory.includes(input)) {
        cityHistory.push(input);
        var cities = document.createElement("li");
        cities.classList = "list-group-item col-6 bg-info";
        cities.innerHTML = input;

        $("#searchHistory").append(cities);
    };

    localStorage.setItem("input", JSON.stringify(cityHistory));
    console.log(cityHistory);




}

var currentWeather = function(data) {
    cityDetails.textContent = "";

    var city = document.createElement("h2");
    city.classList.add("city-name");
    city.innerHTML = data.name + " " + data.weather[0].description;

    cityDetails.append(city);

    var Image = document.createElement("img");
    Image.classList.add("icon");
    Image.src =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    city.append(Image);
    weatherContainer.append(cityDetails);


    var cityInfo = document.createElement("p");
    cityInfo.innerHTML = "Temperature: " + data.main.temp + " °F";
    cityDetails.append(cityInfo);
    var cityInfo = document.createElement("p");
    cityInfo.innerHTML = "Humidity: " + data.main.humidity + "%";
    cityDetails.append(cityInfo);

    var cityInfo = document.createElement("p");
    cityInfo.innerHTML = "Wind Speed: " + data.wind.speed + "MPH";
    cityDetails.append(cityInfo);

    // UV index
    var lat = data.coord.lat;
    var lon = data.coord.lon;


    var uvUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=81cd2e654678051d45857f59eb22e144";


    fetch(uvUrl)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(uvData) {
                        var cityInfo = document.createElement("p");
                        cityInfo.classList = "px-2 py-2 rounded"
                        cityInfo.id = 'uvcolor'
                        cityInfo.innerHTML = "UV Index: " + uvData.current.uvi;
                        var UV = uvData.value;
                        if (UV >= 0 && UV <= 2) {
                            $("#uvcolor").css("background-color", "#bbb2b1").css("color", "white");
                        } else {
                            $("#uvcolor").css("background-color", " #d98880").css("color", "white");
                        }

                        cityDetails.append(cityInfo);

                        fiveDay(uvData);


                    })
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()`
            alert("Unable to connect");
        });



}




var fiveDay = function(forecastData) {
    fiveDayContainer.textContent = "";

    var forecastDisplay = document.createElement("h3");
    forecastDisplay.classList.add("heading");
    forecastDisplay.textContent = "5-Day Forecast";

    fiveDayContainer.append(forecastDisplay);

    for (var i = 0; i < 5; i++) {

        var weeklyForecast = forecastData.daily[i];
        var forecastContainer = document.createElement("div");
        forecastContainer.classList.add("forecast-container");

        fiveDayContainer.append(forecastContainer);

        var cardEl = document.createElement("h3");
        cardEl.classList.add("forecast-date");
        cardEl.innerHTML = weeklyForecast.weather[0].description;

        forecastContainer.append(cardEl);




        var forecastImg = document.createElement("img");
        forecastImg.classList.add("icon");
        forecastImg.src =
            "http://openweathermap.org/img/wn/" + weeklyForecast.weather[0].icon + ".png";
        cardEl.append(forecastImg);

        var forecastInfo = document.createElement("p");
        forecastInfo.classList.add("text");
        forecastInfo.innerHTML = "Temperature: " + weeklyForecast.temp.day + " °F";
        cardEl.append(forecastInfo);

        var forecastInfo = document.createElement("p");
        forecastInfo.classList.add("text");
        forecastInfo.innerHTML = "Humidity: " + weeklyForecast.humidity + "%";
        cardEl.append(forecastInfo);

        var forecastInfo = document.createElement("p");
        forecastInfo.classList.add("text");
        forecastInfo.innerHTML = "Wind: " + weeklyForecast.wind_speed + " MPH";
        cardEl.append(forecastInfo);

        weeklyForecast++;

    }


}



formEL.addEventListener("submit", submitHandler);