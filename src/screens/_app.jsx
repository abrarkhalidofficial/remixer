import React from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function App({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
