import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import CityList from "~/components/CityList";
import { City } from "~/components/CItyCard";
import { json, ActionFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type LoaderData = {
  user: {
    name: string;
  } | null;
  cities: City[]; // Adjusted type for cities
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return { user: null, cities: [] };
  }

  // Fetch cities related to the authenticated user
  const cities = await prisma.city.findMany({
    where: { userId: user.id },
  });

  return { user, cities };
};
// This is the action to add a city to the database
// Action to handle both adding and removing cities
export let action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = new URLSearchParams(await request.text());
  const actionType = formData.get("_action"); // This will tell us whether it's an add or remove action

  if (actionType === "addCity") {
    const cityName = formData.get("cityName");
    if (!cityName) {
      return json({ error: "City name is required" }, { status: 400 });
    }
    console.log("city ", cityName);
    try {
      const city = await prisma.city.create({
        data: {
          name: cityName,
          userId: user.id,
        },
      });
      return json({ city });
    } catch (error) {
      return json({ error: "Error adding city" }, { status: 500 });
    }
  }

  if (actionType === "removeCity") {
    const cityName = formData.get("cityName");
    if (!cityName) {
      return json(
        { error: "City name is required for removal" },
        { status: 400 }
      );
    }

    try {
      const city = await prisma.city.deleteMany({
        where: {
          userId: user.id,
          name: cityName,
        },
      });

      return json({ city });
    } catch (error) {
      return json({ error: "Error removing city" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

function Header({ userName }: { userName: string | undefined }) {
  return (
    <header className="w-full p-4 bg-blue-600 text-white text-center">
      <h1 className="text-2xl font-semibold">
        {`‘Welcome to the weather app, ${userName}`}
      </h1>
    </header>
  );
}

export default function Index() {
  const { user, cities } = useLoaderData<LoaderData>();

  return (
    <div className="flex flex-col h-screen">
      {/* Header at the top */}
      <Header userName={user?.name} />

      {/* Main content below the header */}
      <div className="flex flex-1 flex-col p-4">
        {/* Input box for adding new cities */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Add Your Favorite Cities
          </h2>
          {user ? (
            <CityList cities={cities} />
          ) : (
            <p>Please log in to manage your favorite cities.</p>
          )}
        </div>

        {/* List of cities */}
        <div></div>
      </div>
    </div>
  );
}
