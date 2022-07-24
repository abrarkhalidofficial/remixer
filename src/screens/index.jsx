import React from "react";
import { Link } from "../Components/Link";

export default function index() {
  return (
    <div>
      index
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </div>
  );
}
