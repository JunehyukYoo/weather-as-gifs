// index.js (entry point)

import "./styles.css"
import { getWeather, displayForm } from "./weather";

displayForm();
const container = document.querySelector(".container");
// getWeather('Hong Kong')
//     .then((data) => showWeather(data))
//     .catch(container.innerHTML = 'Retry pls.');



