import React from "react";
import PropTypes from "prop-types";
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

App.propTypes = {
  children: PropTypes.any,
};
