import React from "react";
import PropTypes from "prop-types";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function App({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
  s;
}

App.propTypes = {
  children: PropTypes.any,
};
