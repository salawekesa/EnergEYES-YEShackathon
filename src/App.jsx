import React, { useState, useEffect } from 'react';
import './App.css';

const apiKey = '172ff6342304169f8f3a1643fb96fb66'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const defaultLocation = { latitude: 1.2921, longitude: 36.8219 };

function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [energyRecommendations, setEnergyRecommendations] = useState([]);

  useEffect(() => {
    updateWeatherAndRecommendations(); 
  }, []);
  

  async function getWeatherData(city) {
    try {
      let url;
      if (city) {
        url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
      } else {
        url = `${apiUrl}?lat=${defaultLocation.latitude}&lon=${defaultLocation.longitude}&appid=${apiKey}&units=metric`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  async function updateWeatherAndRecommendations(city) {
    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
      displayEnergyRecommendations(data);
    } catch (error) {
      console.error('Error updating weather and recommendations:', error);
    }
  }

async function displayEnergyRecommendations(data) {
  try {
    if (data.clouds && data.clouds.all !== undefined && data.wind && data.wind.speed !== undefined && data.rain && data.rain['1h'] !== undefined) {
      const cloudiness = data.clouds.all;
      const windSpeed = data.wind.speed;
      const precipitation = data.rain['1h'];

      console.log(windspeed);

      let solarRecommendation = '';
      let windRecommendation = '';
      let hydroRecommendation = '';


      if (cloudiness < 20) {
        solarRecommendation = 'It\'s a good day to use solar panels for maximum efficiency.';
      } else {
        solarRecommendation = 'Cloudy weather may not be ideal for solar panel usage.';
      }
  
      if (windSpeed > 5) {
        windRecommendation = 'Windy weather is suitable for wind turbines.';
      } else {
        windRecommendation = 'Wind speed is low for wind turbine usage.';
      }
  
      if (precipitation > 0) {
        hydroRecommendation = 'Precipitation makes it a good time to utilize hydro services.';
      } else {
        hydroRecommendation = 'No precipitation, consider other energy sources.';
      }
  

      const recommendations = [solarRecommendation, windRecommendation, hydroRecommendation];
      setEnergyRecommendations(recommendations);
    } else {
      setEnergyRecommendations(['Energy recommendations based on weather data will be displayed here.']);
    }
  } catch (error) {
    console.error('Error updating energy recommendations:', error);
    setEnergyRecommendations(['Error updating energy recommendations.']);
  }
}

function handleSearch() {
  const trimmedCity = cityInput.trim();
  if (trimmedCity !== '') {
    updateWeatherAndRecommendations(trimmedCity);
    setCityInput('');
  }
}

  

  return (
    <div className="App">
      <header>
        <h1>EnergYES</h1>
        <p>A Renewable Energy Planner</p>
        <div id="search">
          <input type="text" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="Enter city name" />
          <button onClick={handleSearch}>Search</button>
        </div>
        <p id="location">{`${weatherData.name}, ${weatherData.sys?.country || ''}`}</p>
      </header>
      <main>
        <section>
          <h2>Weather Forecast</h2>
          <div id="weatherData">
            <p>Temperature: {weatherData.main?.temp}°C</p>
            <p>Weather: {weatherData.weather?.[0]?.description}</p>
            <p>Wind Speed: {weatherData.wind?.speed} m/s</p>
            <p>Cloudiness: {weatherData.clouds?.all}%</p>
          </div>
        </section>
        <section>
          <h2>Energy Source Recommendations</h2>
          <div id="recommendations">
            {energyRecommendations.map((recommendations, index) => (
              <p key={index}>{recommendations}</p>
            ))}
          </div>
        </section>
      </main>
    </div>                        
  );
}

export default App;
