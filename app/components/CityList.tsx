import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import CityCard, { City } from "./CItyCard";
// Adjust this import to match the actual path and file name

type CitylistProps = {
  cities: City[]; // Specify the type for the `cities` prop
};

function CityList({ cities }: CitylistProps) {
  const fetcher = useFetcher();
  const [newCity, setNewCity] = useState("");
  const [error, setError] = useState<string>(""); // Error message
  useEffect(() => {
    // Reset error message when cities change (e.g., after adding/removing a city)
    if (cities.length <= 5) {
      setError(""); // Clear error when the list is within the limit
    }
  }, [cities]);

  const addCity = () => {
    console.log(cities.length, "length");
    if (
      cities.some((city) => city.name.toLowerCase() === newCity.toLowerCase())
    ) {
      setError("You can't add the same city again.");
      return;
    }
    if (cities.length >= 5) {
      setError("You can only add up to 5 cities.");
      return;
    }
    console.log(error, "err");
    setError("");
    fetcher.submit(
      { cityName: newCity, _action: "addCity" },
      { method: "post" }
    );
    setNewCity("");
  };

  const removeCity = (cityName: string) => {
    fetcher.submit({ cityName, _action: "removeCity" }, { method: "post" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCity(e.target.value);
    // Clear the error message if the input is empty
    if (e.target.value === "") {
      setError("");
    }
  };
  return (
    <div>
      <input
        type="text"
        value={newCity}
        onChange={handleInputChange}
        className="border p-2 rounded"
        placeholder="Enter city name"
      />
      <button
        onClick={addCity}
        className="bg-blue-500 text-white p-2 rounded ml-5 cursor-pointer"
        disabled={!newCity}
      >
        Add City
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div>
        {cities.map((city) => (
          <CityCard key={city.id} city={city} removeCity={removeCity} />
        ))}
      </div>
    </div>
  );
}

export default CityList;
