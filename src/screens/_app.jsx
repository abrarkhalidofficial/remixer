import React from "react";
import PropTypes from "prop-types";
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

App.propTypes = {
  children: PropTypes.any,
};
