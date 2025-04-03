export async function getWeather(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=WCJHZ5QDW8NJ4BZWT4257ZV7J`;
    const response = await fetch(url, { mode: 'cors'});
    const result = await response.json();
    console.log(result);
    return result;
}

export async function showWeather(data) {
    const { currentConditions } = data;
    const { conditionsItem, datetimeItem, feelslikeItem } = await createWeatherItems(currentConditions);
    const container = document.querySelector(".container").firstChild;
    container.appendChild(datetimeItem);
    container.appendChild(conditionsItem);
    container.appendChild(feelslikeItem);
}

export function displayForm() {
    const container = document.querySelector(".container");
    const form = document.createElement("form");
    form.innerHTML = `<label for="city">Which city would you like to see the temperature of? </label>
                      <input name="city" id="city">
                      <button type="submit">Submit</button>`;
    form.addEventListener('submit', handleForm);
    container.appendChild(form);
}

export async function handleForm(e) {
    e.preventDefault();
    const city = document.querySelector("input").value;
    const container = document.querySelector(".container");
    try {
        const data = await getWeather(city);
        await showWeather(data);
    } catch (error) {
        console.log("is it here...");
        console.log(error);
    }
}

async function createWeatherItems(currentConditions) {
    const { conditions, datetime, feelslike, temp, uvindex, windspeed } = currentConditions;

    const conditionsItem = document.createElement("div");
    conditionsItem.textContent = conditions;
    conditionsItem.classList.add("conditions-item");
    const conditionsImg = document.createElement("img");
    conditionsImg.src = await getImg(`${conditions} weather`);
    conditionsItem.appendChild(conditionsImg);

    const datetimeItem = document.createElement("div");
    datetimeItem.textContent = datetime;

    const feelslikeItem = document.createElement("div");
    feelslikeItem.textContent = feelslike;
    const feelslikeImg = document.createElement("img");
    if (feelslike > 20) {
        feelslikeImg.src = await getImg("warm");
    } else {
        feelslikeImg.src = await getImg("cold");
    }
    feelslikeItem.appendChild(feelslikeImg);

    return { conditionsItem, datetimeItem, feelslikeItem };
}

async function getImg(query) {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=RsWTGGUfZP9MqFwpTJJ7dm5cik2VvuLA&s=${query}`, { mode: 'cors' });
    const result = await response.json();
    return result.data.images.original.url;
}
