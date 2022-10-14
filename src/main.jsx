import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { withStyles } from "react-critical-css";
import style from "./styles/export.scss";

withStyles(style)(
  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
);
