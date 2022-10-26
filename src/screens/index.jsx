import React from "react";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  return "data from loader";
};

export default function index() {
  const data = useLoaderData();
  console.log(data);
  return <div>index</div>;
}
