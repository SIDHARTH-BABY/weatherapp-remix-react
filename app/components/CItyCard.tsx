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
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    precip_mm: number;
    wind_kph: number;
    feelslike_c: number;
    uv: number;
  };
};

function CityCard({ city, removeCity }: CityCardProps) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    setLoading(true); // Set loading to true when the API request starts

    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.name}&aqi=no`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError("Weather data unavailable for this city.");
          setWeather(null);
        } else {
          setWeather(data);
          setError(null); // Clear any previous errors
        }
        setLoading(false); // Set loading to false once the API request completes
      })
      .catch((error) => {
        setError("Unable to fetch weather data. Please try again.");
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  }, [city.name]);

  return (
    <div className="city-card flex flex-col p-4 border-b">
      <h2 className="text-lg font-extrabold text-indigo-600 ">{city.name}</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : weather ? (
        <table className="table-auto mt-4 w-full text-sm text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">Field</th>
              <th className="border px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">City Name</td>
              <td className="border px-4 py-2">{weather.location.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Weather Condition</td>
              <td className="border px-4 py-2">
                {weather.current.condition.text}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Condition Image</td>
              <td className="border px-4 py-2">
                <img
                  src={`https:${weather.current.condition.icon}`}
                  alt={weather.current.condition.text}
                  className="w-8 h-8"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Temperature (°C)</td>
              <td className="border px-4 py-2">{weather.current.temp_c}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Humidity (%)</td>
              <td className="border px-4 py-2">{weather.current.humidity}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Precipitation (mm)</td>
              <td className="border px-4 py-2">{weather.current.precip_mm}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-500">{error}</p>
      )}

      <button
        onClick={() => removeCity(city.name)}
        className="text-red-600 hover:text-red-800 mt-4"
      >
        Remove
      </button>
    </div>
  );
}

export default CityCard;
