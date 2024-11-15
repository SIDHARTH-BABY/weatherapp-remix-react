import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import CityList from "~/components/CityList";
import { City } from "~/components/CItyCard";

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

      {/* Main content centered vertically */}
      <div className="flex flex-1 items-center justify-center">
        <main className="flex flex-1 flex-col items-center justify-center">
          <h2>Your Favorite Cities</h2>
          {user ? (
            <CityList cities={cities} />
          ) : (
            <p>Please log in to manage your favorite cities.</p>
          )}
        </main>
      </div>
    </div>
  );
}
