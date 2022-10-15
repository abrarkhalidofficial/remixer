import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import "./styles/export.scss";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
