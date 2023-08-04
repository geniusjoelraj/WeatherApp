const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()

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
    const apiKey = process.env.API_KEY;
    cityName = _.startCase(req.body.cityName);
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+apiKey+"&units="+unit+"&q="+cityName;
    https.get(url, function(response) {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        if (weatherData.cod === 200) {
          temp = weatherData.main.temp;
          main = weatherData.weather[0].description;
          icon = weatherData.weather[0].icon;
          humidity = weatherData.main.humidity;
          windSpeed = weatherData.wind.speed;
          imgSrc = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
          options = {cityName: cityName, temp: temp, icon: icon, imgSrc: imgSrc, main: main, humidity: humidity, windSpeed: windSpeed};
          res.redirect("/weather");
        } else {
          console.log(weatherData);
          const errorCode = weatherData.cod;
          const errorDesc = weatherData.message;
          options = {errorCode: errorCode, errorDesc: errorDesc};
          res.redirect('/error');
        }
      });
    });  
});

app.get('/error', function(req, res) {
  res.render('error', options);
});



app.listen(port, function() {
  console.log("The server is running on port 3000");
});

