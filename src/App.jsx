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
  
  async function displayEnergyRecommendations(weatherData) {
    try {
      if (weatherData.clouds && weatherData.wind) {
        const cloudiness = weatherData.clouds?.all
        console.log(cloudiness);
        const windSpeed = weatherData.wind?.speed
        console.log(windSpeed);
    
  
        let solarRecommendation = '';
        let windRecommendation = '';
        let hydroRecommendation = '';
  
        if (cloudiness < 20) {
          solarRecommendation = 'It\'s a good day to use solar panels for maximum efficiency.';
        } else {
          solarRecommendation = 'Cloudy weather and temperature may not be ideal for solar panel usage.';
        }
    
        if (windSpeed > 5) {
          windRecommendation = 'Windy weather is suitable for wind turbines.';
        } else {
          windRecommendation = 'Wind speed is low for wind turbine usage.';
        }
  
  
        const recommendations = [solarRecommendation, windRecommendation];
        setEnergyRecommendations(recommendations);

      } else {
        setEnergyRecommendations(['Weather data is incomplete to provide energy recommendations.']);
      }
    } catch (error) {
      console.error('Error updating energy recommendations:', error);
      setEnergyRecommendations(['Error updating energy recommendations.']);
    }
  }
  
// async function displayEnergyRecommendations(data) {
//   try {
//     if (data.clouds && data.clouds.all !== undefined && data.wind && data.wind.speed !== undefined && data.rain && data.rain['1h'] !== undefined) {
//       const cloudiness = data.clouds.all;
//       const windSpeed = data.wind.speed;
//       const precipitation = data.rain['1h'];

//       let solarRecommendation = 'Cloudy weather may not be ideal for solar panel usage.';
//       let windRecommendation = 'Windy weather is suitable for wind turbines.';
//       let hydroRecommendation = 'No precipitation, consider other energy sources.';


//       if (cloudiness < 20) {
//         solarRecommendation = 'It\'s a good day to use solar panels for maximum efficiency.';
//       } else {
//         solarRecommendation = 'Cloudy weather may not be ideal for solar panel usage.';
//       }
  
//       if (windSpeed > 5) {
//         windRecommendation = 'Windy weather is suitable for wind turbines.';
//       } else {
//         windRecommendation = 'Wind speed is low for wind turbine usage.';
//       }
  
//       if (precipitation > 0) {
//         hydroRecommendation = 'Precipitation makes it a good time to utilize hydro services.';
//       } else {
//         hydroRecommendation = 'No precipitation, consider other energy sources.';
//       }
  

//       const recommendations = [solarRecommendation, windRecommendation, hydroRecommendation];
//       setEnergyRecommendations(recommendations);
//     } else {
//       setEnergyRecommendations(['Cloudy weather may not be ideal for solar panel     . \n  Windy weather is suitable for wind turbines . \n Precipitation low, consider other energy sources.']);
//     }
//   } catch (error) {
//     console.error('Error updating energy recommendations:', error);
//     setEnergyRecommendations(['Error updating energy recommendations.']);
//   }
// }

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
      <div>
      <h1>EnergYES</h1>
      <p>A Renewable Energy Planner</p>
      </div>
      
      <div id="search">
        <input type="text" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="Enter city name" />
        <button onClick={handleSearch}>Search</button>
    </div>
    </header>

    <div className="container">

 

    
    <div className="section">
      <div className="inner">
        <picture>
          
        </picture>
        <p>Weather</p>
        <p>Report for</p>
        <h1 id="location">{`${weatherData.name}, ${weatherData.sys?.country || ''}`}</h1>

      </div>
      <ul className="days">
        <li>Daily</li>
        <li>Weekly</li>
        <li className="weekly">Monthly</li>
      </ul>
    </div>

    <div className="main">
        <div className="Bottom-1">
        <div className="inner">
          <ul>
            <li className="title">Temperature</li>
            <li></li>
          </ul>
          <p className="hrs">{weatherData.main?.temp}°C</p>
          
        </div>
        </div>
        <div className="Top-2">
        <div className="inner">
          <ul>
            <li className="title">Cloudiness</li>
            <li></li>
          </ul>
          <p className="hrs">{weatherData.clouds?.all}%</p>
          
      
        </div></div>
        <div className="Top-3">
        <div className="inner">
          <ul>
            <li className="title">Wind Speed</li>
            <li></li>
          </ul>
          <p className="hrs">{weatherData.wind?.speed} m/s</p>
          
      
        </div></div>
        
        <div className="Bottom-2">
        <div className="inner">
          <ul>
            <li className="title">Energy Recommendation</li>
            <li></li>
          </ul>
          <p className="hrs">
          <div id="recommendations">
          {energyRecommendations.map((recommendations, index) => (
            <li key={index}>{recommendations.trim()}</li>
          ))}
        </div>
          </p>
         
      
        </div></div>
    
    </div>
  </div>
    </div>                        
  );
}

export default App;
