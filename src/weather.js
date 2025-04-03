// Show weather 
export async function showWeather(city) {
    const container = document.querySelector(".container");
    container.innerHTML = '';
    container.textContent = '';
    // Fetches weather information from VisualCrossing API
    async function getWeather(city) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=WCJHZ5QDW8NJ4BZWT4257ZV7J`;
        const response = await fetch(url, { mode: 'cors'});
        const result = await response.json();
        return result;
    }
    try {
        const h2 = document.createElement('h2');
        h2.setAttribute('class', 'fontdiner-swanky-regular city-title');
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
export function displayForm() {
    const container = document.querySelector(".form");
    const form = document.createElement("form");
    form.innerHTML = `<label for="city">Which city would you like to see the temperature of? </label>
                      <input name="city" id="city">
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
    conditionsItem.classList.add("item");
    conditionsItem.textContent = `Condition(s): ${conditions}`;
    const conditionsImg = document.createElement("img");
    conditionsImg.src = await getImg(`${conditions}`);
    conditionsItem.appendChild(conditionsImg);

    const datetimeItem = document.createElement("div");
    datetimeItem.classList.add("item");
    datetimeItem.textContent = `Current time: ${datetime.slice(0, datetime.lastIndexOf(':'))}`;
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
    tempItem.classList.add("item");
    tempItem.textContent = `Currently ${temp}\u00B0C. Feels like ${feelslike}\u00B0C`;
    const tempImg = document.createElement("img");
    console.log(`Feels like is ${feelslike}`);
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
    uvItem.classList.add("item");
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
    windspeedItem.classList.add("item");
    windspeedItem.textContent = `Windspeed: ${windspeed}km/h`;
    const windspeedImg = document.createElement("img");
    if (windspeed < 20) {
        windspeedImg.src = await getImg('not that windy');
    } else if (windspeed < 50) {
        windspeedImg.src = await getImg('breezy');
    } else if (windspeed < 90) {
        windspeedImg.src = await getImg('windy');
    } else {
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
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=RsWTGGUfZP9MqFwpTJJ7dm5cik2VvuLA&s=${query}`, { mode: 'cors' });
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


function capitalizeWords(str) {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }