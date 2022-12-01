import { Footer, Header } from "components";

import { Outlet } from "react-router-dom";
import React from "react";

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
