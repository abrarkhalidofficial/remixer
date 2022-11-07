import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "components";

export default function App({ not404 }) {
  return (
    <>
      {not404 ? <Header /> : null}
      <Outlet />
      {not404 ? <Footer /> : null}
    </>
  );
}
