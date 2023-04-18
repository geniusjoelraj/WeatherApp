const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.set("view engine", "ejs");

var cityName = "";
var temp = "";
var icon = "";
var imgSrc = "";
var main = "";
var humidity = "";
var windSpeed = "";

let options = {cityName: cityName, temp: temp, icon: icon, imgSrc: imgSrc, main: main, humidity: humidity, windSpeed: windSpeed};

app.get("/weather", function(req, res) {
  res.render("list", options);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname+"/index.html");
});


app.post("/weather", function(req, res) {
    const apiKey = "d866771451e22170ef171a90f6c0b704";
    cityName = req.body.cityName;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+apiKey+"&units="+unit+"&q="+cityName;
    https.get(url, function(response) {
      console.log(response.statusCode);
      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        console.log(weatherData);
        temp = weatherData.main.temp;
        main = weatherData.weather[0].description;
        icon = weatherData.weather[0].icon;
        humidity = weatherData.main.humidity;
        windSpeed = weatherData.wind.speed;
        imgSrc = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
        options = {cityName: cityName, temp: temp, icon: icon, imgSrc: imgSrc, main: main, humidity: humidity, windSpeed: windSpeed};
        res.redirect("/weather");
      });
    });
    
})



app.listen(3000, function() {
  console.log("The server is running on port 3000");
});

