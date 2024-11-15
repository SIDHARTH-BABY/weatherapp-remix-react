import { useEffect, useState } from "react";

export type City = {
  id: string;
  name: string;
};

type CityCardProps = {
  city: City;
  removeCity: (cityName: string) => void;
};
type Weather = {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};
function CityCard({ city, removeCity }: CityCardProps) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state to handle API errors

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.name}&aqi=no`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError("Weather data unavailable for this city.");
          setWeather(null); // Ensure weather is set to null in case of error
        } else {
          setWeather(data);
        }
      })
      .catch((error) => {
        setError("Unable to fetch weather data. Please try again.");
        console.error("Error fetching weather data:", error);
      });
  }, [city.name]);

  return (
    <div className="city-card flex items-center space-x-4 p-4 border-b">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{city.name}</h2>
      </div>

      {weather ? (
        <div className="flex items-center space-x-2">
          <p className="text-sm">{weather.current.temp_c}°C</p>
          <p className="text-sm">{weather.current.condition.text}</p>
          <img
            className="w-8 h-8"
            src={`https:${weather.current.condition.icon}`} // Ensure the icon path starts with 'https:'
            alt={weather.current.condition.text}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-500">{error}</p>
      )}

      <button
        onClick={() => removeCity(city.name)}
        className="text-red-600 hover:text-red-800 ml-4"
      >
        Remove
      </button>
    </div>
  );
}

export default CityCard;
