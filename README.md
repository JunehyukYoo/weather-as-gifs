# Weather as GIFs

## Overview

This project is a weather dashboard that displays the current weather conditions for a user-specified city with GIFs! It automatically attempts to display the weather for the user's current location using Google Maps APIs (Geolocation and Geocoding). If location access is denied or an error occurs, it defaults to displaying weather information for Chicago. The application retrieves weather data from the Visual Crossing API and supplements the visual experience with relevant GIFs fetched from the Giphy API.

## Demo Website

https://junehyukyoo.github.io/weather-as-gifs/

## Features

- **Dynamic Weather Display:**  
  Retrieves and displays current weather conditions including temperature, "feels like" temperature, UV index, and windspeed.
  
- **Location Detection:**  
  Uses the Google Geolocation API to determine the user's coordinates, and the Google Geocoding API to translate these into a city name. If the location access is denied or fails, it defaults to Chicago.

- **Fun Visuals:**  
  Enhances weather information with contextual GIFs obtained via the Giphy API based on the current weather conditions.

## Skills and Techniques

- **Asynchronous Programming:**  
  This project makes extensive use of asynchronous functions to handle API calls. Both **promise chaining** and **async/await** methods are employed, demonstrating the ability to manage asynchronous logic in multiple ways:
  
  - **Promise Chaining:**  
    Used in parts of the project to handle API responses and errors in a concise, readable manner.
  
  - **Async/Await:**  
    Provides a more synchronous-style code flow for handling asynchronous operations, making it easier to read and maintain. This approach is used in fetching weather data, processing user input, and loading GIF images.

- **API Integration:**  
  The project integrates several APIs:
  - **Google Geolocation API:**  
    Determines the user's current position.
  - **Google Geocoding API:**  
    Converts latitude and longitude into a city name.
  - **Visual Crossing API:**  
    Retrieves detailed weather data for a specified city.
  - **Giphy API:**  
    Fetches GIFs that visually represent the current weather conditions.

- **DOM Manipulation:**  
  The project dynamically creates and styles HTML elements to display weather information in a user-friendly format.

- **Modern JavaScript Practices:**  
  Utilizes ES6 modules, template literals, arrow functions, and destructuring assignments to write clean, efficient code.

## Setup and Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/JunehyukYoo/weather-as-gifs.git
   cd weather-as-gifs
   ```

2. **Install Dependencies:**

   This project primarily uses vanilla JavaScript, so no additional packages are required unless you choose to integrate a bundler or development server.

3. **API Keys:**

   - Obtain an API key for the Visual Crossing weather API.
   - Obtain an API key for the Giphy API.
   - Obtain an API key for Google Maps APIs (enable both Geolocation and Geocoding).

   Enter your API keys at the top of `weather.js`:

   ```javascript
   // weather.js
   const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
   const VISUAL_CROSSING_API_KEY = 'YOUR_VISUAL_CROSSING_API_KEY';
   const GIPHY_API_KEY = 'YOUR_GIPHY_API_KEY';
   ```


4. **Run the Application:**

   Open `index.html` in your browser. The application will attempt to detect your location and display the weather accordingly. If location access is not granted, it defaults to Chicago. You can alternatively run scripts defined in my webpack-template repository. 

## Conclusion

This project highlights advanced asynchronous programming techniques in JavaScript, showcasing both promise chaining and async/await patterns. It also demonstrates proficiency in integrating multiple third-party APIs to build a rich, interactive user experience. Whether fetching weather data, handling user permissions, or displaying contextual GIFs, this dashboard combines modern web development practices with real-world API integrations to deliver a seamless weather application.