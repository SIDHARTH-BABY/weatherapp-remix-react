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

  // Fetch weather data when the component loads
  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city.name}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, [city.name]);

  return (
    <div className="city-card">
      <h2>{city.name}</h2>
      {weather ? (
        <div>
          <p>{weather.current.temp_c}°C</p>
          <p>{weather.current.condition.text}</p>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={() => removeCity(city.name)}>Remove</button>
    </div>
  );
}

export default CityCard;
