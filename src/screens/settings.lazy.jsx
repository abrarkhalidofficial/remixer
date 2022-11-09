import React from "react";
import { useLoaderData } from "react-router-dom";
import { Head, Link } from "../Router";
import { react } from "assets";

export const loader = async () => {
  return "data from loader";
};

export default function Settings() {
  const data = useLoaderData();
  return (
    <div>
      <Head
        title="Settings | Demo Template"
        description="Settings | Demo Template"
      />
      settings
      <img src={react} alt="react" />
      <div>{data}</div>
      <Link to="/">Home</Link>
    </div>
  );
}
