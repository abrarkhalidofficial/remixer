import React from "react";
import { Helmet } from "react-helmet";

export default function Head({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description ? description : title} />
    </Helmet>
  );
}
