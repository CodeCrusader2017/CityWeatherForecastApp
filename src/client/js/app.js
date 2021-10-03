//Import application utility functions
import { checkUserInput } from './checkUserInput'

// Constants for geonames, weatherbit, and pixabay APIs (note: the private API access keys are stored in an .env file in root, and accessed via server calls below):
const baseGEOURL1 = 'http://api.geonames.org/searchJSON?q='; 
const baseGEOURL2 = '&maxRows=1&isNameRequired=true&username=';

const weatherbitcurrent1 = 'https://api.weatherbit.io/v2.0/current?&lat='
const weatherbitcurrent2 = '&lon='
const weatherbitcurrent3 = '&key='

const weatherbitforecast1 = 'https://api.weatherbit.io/v2.0/forecast/daily?&lat='
const weatherbitforecast2 = '&lon='
const weatherbitforecast3 = '&key='

const pixabayimage1 = 'https://pixabay.com/api/?key='
const pixabayimage2 = '&q='
const pixabayimage3 = '+tourist&image_type=photo&pretty=true'

main();

function main() {
  document.getElementById('generate').addEventListener('click', performAction);
}

function performAction(e){
    let cityLocation = "";
    let geoAPI = "";
    let currentDateTimePlus7days = new Date(); 

    currentDateTimePlus7days.setDate(currentDateTimePlus7days.getDate() + 7);
    console.log("currentDateTime + 7 days = " + currentDateTimePlus7days);
    cityLocation = document.getElementById('cityLocation').value; 

    if (!checkUserInput(cityLocation)) {
       console.log("The user did not enter a city travel location - and was prompted to enter one ! ")
       alert("Please enter a city travel to location ! ");
       return;
    } 

    let dateinput = new Date(document.getElementById('dateinput').value);
    console.log("cityLocation = " + cityLocation);
    console.log("dateinput = " + dateinput);
            
    fetch('http://localhost:4000/getapikey')  //Get API keys from server (i.e. stored in a .env file on root folder for security)
    .then(function(response) { 
       return response.json()
    })
    .then(function(response) {  
       geoAPI = response.apikey;
       console.log("GEO API key = " + geoAPI.substring(0,16)); 
       console.log("Weather API key = " + geoAPI.substring(16,48));
       console.log("pixabay API key = " + geoAPI.substring(48,82));
       return getGeoCoordinatesAPI(baseGEOURL1, cityLocation, baseGEOURL2, geoAPI.substring(0,16));    //Get the GEO co-ordinates for the city 
    })
    .then(function(data){
         let geobitAPI = geoAPI;
         console.log("geo data = " + data);   // Get the weather forecast (current or future) for the city GEO co-ordinates
         if (dateinput > currentDateTimePlus7days) {   
             console.log("Travel date is greater than current date + 7 days")
             return getWeatherbit(weatherbitforecast1, data.geonames[0].lat, weatherbitforecast2, data.geonames[0].lng, weatherbitforecast3, geobitAPI.substring(16,48)); 
         } else {
             console.log("Travel date is NOT greater than current date + 7 days")
             return getWeatherbit(weatherbitcurrent1, data.geonames[0].lat, weatherbitcurrent2, data.geonames[0].lng, weatherbitcurrent3, geobitAPI.substring(16,48));
         }
    })
    .then (function(weatherresults) { //Write weather results to the server to allow for possible storage to a database, flat file etc (n.b. NO need to write GEO co-ordinates to server)
         console.log("weatherresults data = " + weatherresults);
         if (dateinput > currentDateTimePlus7days) {
            console.log(weatherresults.data[7].weather.description); 
            console.log(weatherresults.data[15].weather.description); 
            postForecastWeatherData('/addForecastWeatherInfo', {weatherdescriptionForecast8dayahead: weatherresults.data[7].weather.description, weathertempForecast8dayahead: weatherresults.data[7].temp, 
                                                                weatherdescriptionForecast16dayahead: weatherresults.data[15].weather.description, weathertempForecast16dayahead: weatherresults.data[15].temp,
                                                                cityLocationDestination: cityLocation});
         } else {
            console.log(weatherresults.data[0].weather.description);
            postCurrentWeatherData('/addCurrentWeatherInfo', {weatherdescriptionCurrent: weatherresults.data[0].weather.description, weathertempCurrent: weatherresults.data[0].app_temp,
                                                              cityLocationDestination: cityLocation})
         }
         //Get city image - but do NOT write to server for copyright reasons
         return getpixabay(pixabayimage1, geoAPI.substring(48,82), pixabayimage2, cityLocation, pixabayimage3);  
    })
    .then (function(pixabayDataResults) {  //Get the stored weather results from the server, get the city image from pixabay.com, and then display on the front end 
      console.log("pixabay imageresults data = " + pixabayDataResults);
      console.log("pixabay webformatURL image = " + pixabayDataResults.hits[0].webformatURL);
      if (dateinput > currentDateTimePlus7days) {
         updateForecastWeatherUI('/allForecastWeatherInfo')
      } else {
         updateCurrentWeatherUI('/allCurrentWeatherInfo')
      }
      document.getElementById('cityimage').innerHTML = '<img src="' + pixabayDataResults.hits[0].webformatURL + '" width="500" height="100">';
      document.getElementById('picturecredits').innerHTML = '<a href = "https://pixabay.com/service/about/#goodies" target="_blank"> Image by www.pixabay.com</a>';
    })
};


const getGeoCoordinatesAPI = async (baseGEOURL1, cityLocation, baseGEOURL2, apikey) =>{  
    console.log("cityLocation = " + cityLocation);
    console.log("baseGEOURL1 = " + baseGEOURL1);
    console.log("baseGEOURL2 = " + baseGEOURL2);
    const res = await fetch(baseGEOURL1+cityLocation+baseGEOURL2+apikey)
    try {
       const weatherData = await res.json();  
       console.log(weatherData)  
       if (weatherData.totalResultsCount == 0) {
          console.log("Error calling getGeoCoordinatesAPI API - city name not found and user prompted to check and re-try ");
          alert("Sorry that city location was not found - please check name and retry ...");
       }
       return weatherData;
    } catch (error) {
        console.log("Error calling getGeoCoordinatesAPI API; the error message was: ", error);
    }
}

const getWeatherbit = async (weatherbitcurrent1, lat, weatherbitcurrent2, lng, weatherbitcurrent3, geoAPI) =>{  
  const res = await fetch(weatherbitcurrent1+lat+weatherbitcurrent2+lng+weatherbitcurrent3+geoAPI)
  try {
     const weatherbitData = await res.json();  
     console.log(weatherbitData)  
     //if (weatherbitData.hits[0] == null) {
     //   alert("Sorry that city location was found - but there is no city image so we were unable to return any results (sorry). Please choose another city ...");
     //}
     return weatherbitData;
  } catch (error) {
      console.log("Error calling getWeatherbit API, the error message was: ", error);
  }
}

const getpixabay = async (pixabayimage1, pixabayAPI, pixabayimage2, city, pixabayimage3) =>{  
  const res = await fetch(pixabayimage1+pixabayAPI+pixabayimage2+city+pixabayimage3)
  try {
     const pixabayData = await res.json();  
     console.log(pixabayData)  
     console.log("pixabay webformatURL image = " + pixabayData.hits[0].webformatURL);
     return pixabayData;
  } catch (error) {
      console.log("Error calling pixabay.com API, error message = ", error);
  }
}

const postCurrentWeatherData = async ( url = '', data = {})=>{
    console.log(data)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
                'Content-Type': 'application/json',
        },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
});

    try {
        const newPostCurrentWeatherData = await response.json();  
        console.log(newPostCurrentWeatherData);  
        return newPostCurrentWeatherData;
     } catch (error) {
         console.log("Error calling postCurrentWeatherData API, error message = ", error);
     }
}

const postForecastWeatherData = async ( url = '', data = {})=>{
  console.log(data)
  const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
              'Content-Type': 'application/json',
      },
  body: JSON.stringify(data), // body data type must match "Content-Type" header        
});

  try {
      const newPostForecastWeatherData = await response.json();  
      console.log(newPostForecastWeatherData);  
      return newPostForecastWeatherData;
   } catch (error) {
       console.log("Error calling postForecastWeatherData API, error message = ", error);
   }
}

const updateCurrentWeatherUI = async (url = '') => {
    const request = await fetch(url);
    try{
      const allCurrentWeatherData = await request.json();
      console.log(allCurrentWeatherData);
      document.getElementById('weather').innerHTML = 'For ' + allCurrentWeatherData.cityLocationDestination + ' the current weather is: ' + allCurrentWeatherData.weatherdescriptionCurrent + ', with a temperature of ' + allCurrentWeatherData.weathertempCurrent + ' degrees celsius.';
      document.getElementById('weatherfcastextradays').innerHTML = '';
    }catch(error){
      console.log("error inside updateCurrentWeatherUI API call, the error was = ", error);
    }
}
  
const updateForecastWeatherUI = async (url = '') => {
    const request = await fetch(url);
    try{
      const allForecastWeatherData = await request.json();  
      console.log(allForecastWeatherData);
      document.getElementById('weather').innerHTML = 'For ' + allForecastWeatherData.cityLocationDestination + ' the forecast weather (8 days from current date) is: ' + allForecastWeatherData.weatherdescriptionForecast8dayahead + ', with a temperature of ' + allForecastWeatherData.weathertempForecast8dayahead + ' degrees celsius.';
      document.getElementById('weatherfcastextradays').innerHTML = 'For ' + allForecastWeatherData.cityLocationDestination + ' the forecast weather (16 days from current date) is: ' + allForecastWeatherData.weatherdescriptionForecast16dayahead + ', with a temperature of ' + allForecastWeatherData.weathertempForecast16dayahead + ' degrees celsius.';

    }catch(error){
      console.log("error inside updateForecastWeatherUI API call, the error was = ", error);
    }
}

export { performAction }
export { getGeoCoordinatesAPI } 
export { getWeatherbit }
export { postCurrentWeatherData } 
export { updateCurrentWeatherUI }
export { postForecastWeatherData }
export { updateForecastWeatherUI }
