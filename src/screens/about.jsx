import React from "react";
import { Head, Link } from "router";

export default function About() {
  return (
    <div>
      <Head title="About | Demo Template" description="About | Demo Template" />
      about
      <Link to="/">Home</Link>
    </div>
  );
}
