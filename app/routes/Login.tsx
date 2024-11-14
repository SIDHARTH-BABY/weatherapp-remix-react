import { useActionData } from "@remix-run/react";
import React, { useState } from "react";
import Layout from "~/components/Layout";
import Textfield from "~/components/Textfield";
import { authenticator } from "~/utils/auth.server";
import { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { MetaFunction } from "@remix-run/node";

// Define the structure of the action data
type ActionData = {
  fields?: {
    name?: string;
    password?: string;
  };
};

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App login" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  })
  return user
}

export const action: ActionFunction = async ({ request }) => {
  return authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

const login = () => {
  const actionData = useActionData<ActionData>();
  const [formData, setFormData] = useState({
    name: actionData?.fields?.name || "",
    password: actionData?.fields?.password || "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    console.log(field, event.target.value,'coming here');

    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Layout>
      <div className="h-full justify-center bg-yellow-100 items-center flex flex-col gap-y-5">
        <form method="POST" className="rounded-2xl bg-white p-6 w-96">
          <h2 className="text-3xl font-extrabold text-black-600 mb-5">Login</h2>
          <Textfield
            htmlFor="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
          <Textfield
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
          />
          <div className="w-full text-center mt-5">
            <button
              type="submit"
              name="_action"
              value="Sign In"
              className="w-full rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default login;
