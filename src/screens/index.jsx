import React from "react";
import { Link } from "../components/Link";

export default function index() {
  return (
    <div>
      index
      <Link to="/">Home</Link>
      <Link to="/about" as="NavLink">
        About
      </Link>
    </div>
  );
}
