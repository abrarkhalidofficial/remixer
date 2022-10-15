import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function App({ children, not404 }) {
  return (
    <>
      {not404 ? <Header /> : null}
      {children}
      {not404 ? <Footer /> : null}
    </>
  );
}
