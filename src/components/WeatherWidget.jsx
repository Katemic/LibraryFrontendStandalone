import { useEffect, useState } from 'react';

//API LINK: https://open-meteo.com/en/docs

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true';

function getWeatherText(weatherCode) {
  if (weatherCode === 0) return 'clear sky';
  if ([1, 2, 3].includes(weatherCode)) return 'partly cloudy';
  if ([45, 48].includes(weatherCode)) return 'foggy';
  if ([51, 53, 55, 61, 63, 65].includes(weatherCode)) return 'rainy';
  if ([71, 73, 75].includes(weatherCode)) return 'snowy';
  if ([95, 96, 99].includes(weatherCode)) return 'stormy';

  return 'nice reading weather';
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWeather() {
      try {
        const response = await fetch(WEATHER_URL);

        if (!response.ok) {
          throw new Error('Could not load weather.');
        }

        const data = await response.json();
        setWeather(data.current_weather);
      } catch {
        setError('Weather is unavailable right now.');
      }
    }

    loadWeather();
  }, []);

  if (error) {
    return (
      <section className="weather-card" data-testid="weather-widget">
        <h2>Library weather</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!weather) {
    return (
      <section className="weather-card" data-testid="weather-widget">
        <h2>Library weather</h2>
        <p>Loading weather...</p>
      </section>
    );
  }

  return (
    <section className="weather-card" data-testid="weather-widget">
      <h2>It&apos;s perfect library weather 📚</h2>
      <p>
        Copenhagen is currently {Math.round(weather.temperature)}°C and{' '}
        {getWeatherText(weather.weathercode)}.
      </p>
      <p>Wind speed: {Math.round(weather.windspeed)} km/h</p>
    </section>
  );
}