import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./context/themeContext";
import { Router } from "./Router";
import { withStyles } from "react-critical-css";
import style from "./styles/export.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

withStyles(style)(
  root.render(
    <BrowserRouter>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  )
);
