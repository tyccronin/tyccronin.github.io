var weather = {
    "apiKey": "bc19572e13de3734f262ebe366558f66",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
            ).then((response)=>response.json()
            ).then((data)=>this.displayWeather(data));
    },
    displayWeather: function(data) {
        var { name } = data;
        var { icon, description } = data.weather[0];
        var { temp, humidity } = data.main;
        var { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather In " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if(event.key == "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Vancouver");
