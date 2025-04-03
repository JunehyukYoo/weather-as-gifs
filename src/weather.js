// API KEYS FOR PUBLIC USE
const GOOGLE_API_KEY = 'YOUR API KEY HERE';
const VISUAL_CROSSING_API_KEY = 'YOUR API KEY HERE';
const GIPHY_API_KEY = 'YOUR API KEY HERE';

// Initializes website by displaying weather for current location
// If client location cannot be determined, defaults to Chicago.
export function init() {
    displayForm();
    getGeolocation().then(result => {
        const { location: { lat, lng } } = result;
        return reverseGeocode(lat, lng);
    }).then(city => {
        if (city) {
            showWeather(city);
        } else {
            console.warn('City not found via reverse geocoding. Defaulting to Chicago.');
            showWeather('Chicago');
        }
    }).catch((error) => {
        console.log(error);
        console.log('Google API error. Defaulting to Chicago.');
        showWeather('Chicago');
    });
}

// Google geolocation API to get client location coordinates
async function getGeolocation() {
    const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`, {method: 'POST'});
    return response.json();
}

// Google geocode API to get city name from coordinates using reverse geocode
async function reverseGeocode(lat, lng) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${GOOGLE_API_KEY}`, {mode: 'cors'});
    const result = await response.json();
    const city = result.results[0].address_components.find(component => component.types.includes('locality'));
    return city ? city.long_name : null;
}


// Show weather 
async function showWeather(city) {
    const container = document.querySelector(".container");
    container.innerHTML = '';
    container.textContent = '';
    // Fetches weather information from VisualCrossing API
    async function getWeather(city) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${VISUAL_CROSSING_API_KEY}`;
        const response = await fetch(url, { mode: 'cors'});
        const result = await response.json();
        return result;
    }
    try {
        const h2 = document.createElement('h2');
        h2.setAttribute('class', 'city-title');
        h2.textContent = capitalizeWords(city.trim());
        container.appendChild(h2);

        const data = await getWeather(city);
        const { currentConditions } = data;
        const weatherContent = await createWeatherItems(currentConditions);
        container.appendChild(weatherContent);
    } catch (error) {
        // SHOW ERROR
        console.log(error);
        container.textContent = "Error. Try again!";
    }
}

// Display form
function displayForm() {
    const container = document.querySelector(".form");
    const form = document.createElement("form");
    form.innerHTML = `<label for="city">Which city would you like to see the temperature of? </label>
                      <input name="city" id="city" required>
                      <button type="submit">Submit</button>`;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.querySelector("input").value;
        await showWeather(city);
    });
    container.appendChild(form);
}

// Creates relevant weather DOM items
async function createWeatherItems(currentConditions) {
    console.log(currentConditions);
    let { conditions, datetime, feelslike, temp, uvindex, windspeed } = currentConditions;
    feelslike = ftoC(parseFloat(feelslike));
    temp = ftoC(parseFloat(temp));
    windspeed = mphToKph(parseFloat(windspeed));

    const weatherContent = document.createElement('div');
    weatherContent.classList.add('weather-content');

    const conditionsItem = document.createElement("div");
    conditionsItem.setAttribute('class', 'item');
    conditionsItem.textContent = `Condition(s): ${conditions}`;
    const conditionsImg = document.createElement("img");
    conditionsImg.src = await getImg(`${conditions}`);
    conditionsItem.appendChild(conditionsImg);

    const datetimeItem = document.createElement("div");
    datetimeItem.setAttribute('class', 'item');
    datetimeItem.textContent = `Updated: ${datetime.slice(0, datetime.lastIndexOf(':'))}`;
    const datetimeImg = document.createElement('img');
    const hour = parseInt(datetime.slice(0, datetime.indexOf(':')));
    if (hour < 6) {
        datetimeImg.src = await getImg('night');
    } else if (hour < 12) {
        datetimeImg.src = await getImg('morning');
    } else if (hour < 17) {
        datetimeImg.src = await getImg('afternoon');
    } else if (hour < 21) {
        datetimeImg.src = await getImg('evening');
    } else {
        datetimeImg.src = await getImg('night');
    }
    datetimeItem.appendChild(datetimeImg);

    const tempItem = document.createElement("div");
    tempItem.setAttribute('class', 'item');
    tempItem.textContent = `Currently ${temp}\u00B0C. Feels like ${feelslike}\u00B0C`;
    const tempImg = document.createElement("img");
    if (feelslike < -10) {
        tempImg.src = await getImg('freezing');
    } else if (feelslike < 0) {
        tempImg.src = await getImg('cold');
    } else if (feelslike < 10) {
        tempImg.src = await getImg('chilly');
    } else if (feelslike < 20) {
        tempImg.src = await getImg('perfect');
    } else if (feelslike < 30) {
        tempImg.src = await getImg('warm');
    } else {
        tempImg.src = await getImg('hot');
    }
    tempItem.appendChild(tempImg);

    const uvItem = document.createElement('div');
    uvItem.setAttribute('class', 'item');
    uvItem.textContent = `UV index: ${uvindex}`;
    const uvImg = document.createElement('img');
    if (uvindex < 3) {
        uvImg.src = await getImg('where');
    } else if (uvindex < 6) {
        uvImg.src = await getImg('chill guy meme');
    } else if (uvindex < 8) {
        uvImg.src = await getImg('sunscreen');
    } else {
        uvImg.src = await getImg('sun burn');
    }
    uvItem.appendChild(uvImg);

    const windspeedItem = document.createElement('div');
    windspeedItem.setAttribute('class', 'item');
    const windspeedImg = document.createElement("img");
    if (windspeed < 20) {
        windspeedItem.textContent = `Windspeed: Calm at ${windspeed}km/h`;
        windspeedImg.src = await getImg('not that windy');
    } else if (windspeed < 50) {
        windspeedItem.textContent = `Windspeed: Breezy at ${windspeed}km/h`;
        windspeedImg.src = await getImg('breezy');
    } else if (windspeed < 90) {
        windspeedItem.textContent = `Windspeed: Windy at ${windspeed}km/h`;
        windspeedImg.src = await getImg('windy');
    } else {
        windspeedItem.textContent = `Windspeed: Dangerous at ${windspeed}km/h`;
        windspeedImg.src = await getImg('tornado');
    }
    windspeedItem.appendChild(windspeedImg);

    weatherContent.appendChild(datetimeItem);
    weatherContent.appendChild(conditionsItem);
    weatherContent.appendChild(tempItem);
    weatherContent.appendChild(uvItem);
    weatherContent.appendChild(windspeedItem);

    return weatherContent;
}

// Fetches GIF with query from Giphy API
async function getImg(query) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${query}`, { mode: 'cors' });
    const result = await response.json();
    return result.data.images.original.url;
}

// Fahrenheit -> Celcius (4 significant figures)
function ftoC(temp) {
    return parseFloat(((temp - 32) * 5/9).toPrecision(4));
}

// Miles/hour -> Km/hour (4 significant figures)
function mphToKph(mph) {
    return parseFloat((mph * 1.60934).toPrecision(4));
}

// Capitalizes city name properly
function capitalizeWords(str) {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }