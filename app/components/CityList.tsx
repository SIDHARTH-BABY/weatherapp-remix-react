import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import CityCard, { City } from "./CItyCard";
 // Adjust this import to match the actual path and file name

type CitylistProps = {
  cities: City[]; // Specify the type for the `cities` prop
};

function CityList({ cities }: CitylistProps) {
  const fetcher = useFetcher();
  const [newCity, setNewCity] = useState("");

  const addCity = () => {
    fetcher.submit(
      { cityName: newCity, _action: "addCity" },
      { method: "post" }
    );
    setNewCity("");
  };

  const removeCity = (cityName: string) => {
    fetcher.submit({ cityName, _action: "removeCity" }, { method: "post" });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={newCity}
        onChange={(e) => setNewCity(e.target.value)}
      />
      <button onClick={addCity} disabled={!newCity || cities.length >= 5}>
        Add City
      </button>

      <div>
        {cities.map((city) => (
          <CityCard key={city.id} city={city} removeCity={removeCity} />
        ))}
      </div>
    </div>
  );
}

export default CityList;
