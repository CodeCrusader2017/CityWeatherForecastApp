// To RUN: 
// a). Create two split terminals, and in each terminal window navigate to root.
// b). In the "Production" terminal, on the command line do (i.e. without quotes) "npm run build-prod"  followed by "npm run start"  (i.e. start script in package.json)
// c). In the "DEV" terminal, on the command line do (without quotes) "npm run build-dev" 
// d). Note: the PROD terminal opens "localhost:4000", while DEV terminal opens "localhost:8080". For background see: https://knowledge.udacity.com/questions/313437 

//Set up access to .env file to obtain private geonames.org username key
const dotenv = require('dotenv');
dotenv.config();

// Setup empty JavaScript array object to act as API application endpoints for all current and forecast weather/city destination information routes
projectCurrentWeatherData = {}; 
projectForecastWeatherData = {}; 

// Setup Node.js Server Middleware environment to run Express for routes processing   
var path = require('path');
//console.log(path);
const express = require('express');                      
const weatherApp = express();    

// Configure Express to set up the bodyParser middle-ware to allow the application to use JSON parsing 
const bodyParser = require('body-parser');                
weatherApp.use(bodyParser.urlencoded({ extended: false }));     
weatherApp.use(bodyParser.json());

// Use Cors for cross origin allowance
const cors = require('cors');                            
weatherApp.use(cors());

//point to the project folder with .html, .css, and .js files.    
weatherApp.use(express.static('dist')); 
console.log(__dirname);

//spin up the node.js server with a callback to listen on port 4000 to confirm on the command line that the server is running at this port
const port = 4000;
const server = weatherApp.listen(port, listening);              
function listening(){
    console.log(`running on localhost: ${port}`);
};

weatherApp.post('/addCurrentWeatherInfo', addCurrentWeatherInfo);
function addCurrentWeatherInfo (req, res){
    projectCurrentWeatherData = {
        weatherdescriptionCurrent: req.body.weatherdescriptionCurrent,
        weathertempCurrent: req.body.weathertempCurrent,
        cityLocationDestination: req.body.cityLocationDestination
    }
    res.send(projectCurrentWeatherData);
    console.log("In current weather post = " + projectCurrentWeatherData.weatherdescriptionCurrent + " " + projectCurrentWeatherData.weathertempCurrent + " " + projectCurrentWeatherData.cityLocationDestination);
};
  
weatherApp.get('/allCurrentWeatherInfo', getAllCurrentWeatherData);
function getAllCurrentWeatherData(req, res){
    res.send(projectCurrentWeatherData);
    console.log("In current weather get = " + projectCurrentWeatherData.weatherdescriptionCurrent + " " + projectCurrentWeatherData.weathertempCurrent + " " + projectCurrentWeatherData.cityLocationDestination);
}

weatherApp.post('/addForecastWeatherInfo', addForecastWeatherInfo);
function addForecastWeatherInfo (req, res){
    projectForecastWeatherData = {
        weatherdescriptionForecast8dayahead: req.body.weatherdescriptionForecast8dayahead,
        weathertempForecast8dayahead: req.body.weathertempForecast8dayahead,
        weatherdescriptionForecast16dayahead: req.body.weatherdescriptionForecast16dayahead,
        weathertempForecast16dayahead: req.body.weathertempForecast16dayahead,
        cityLocationDestination: req.body.cityLocationDestination
    }
    res.send(projectForecastWeatherData);
    console.log("In forecast weather post 8 days ahead = " + projectForecastWeatherData.weatherdescriptionForecast8dayahead + " " + projectForecastWeatherData.weathertempForecast8dayahead + " " + projectForecastWeatherData.cityLocationDestination);
    console.log("In forecast weather post 15 days ahead = " + projectForecastWeatherData.weatherdescriptionForecast16dayahead + " " + projectForecastWeatherData.weathertempForecast16dayahead + " " + projectForecastWeatherData.cityLocationDestination);
};
  
weatherApp.get('/allForecastWeatherInfo', getAllForecastWeatherData);
function getAllForecastWeatherData(req, res){
    res.send(projectForecastWeatherData);
    console.log("In forecast weather get 8 days ahead = " + projectForecastWeatherData.weatherdescriptionForecast8dayahead + " " + projectForecastWeatherData.weathertempForecast8dayahead + " " + projectForecastWeatherData.cityLocationDestination);
    console.log("In forecast weather get 16 days ahead = " + projectForecastWeatherData.weatherdescriptionForecast16dayahead + " " + projectForecastWeatherData.weathertempForecast16dayahead + " " + projectForecastWeatherData.cityLocationDestination);
}

//Return private MeaningCloud.com API key (in JSON format) when requested by client 
weatherApp.get('/getapikey', function (req, res) {
    console.log(`Your API key is ${process.env.API_KEY}`);
    res.send({'apikey': process.env.API_KEY})
})
