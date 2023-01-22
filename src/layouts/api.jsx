import express from "express";

const API_ROUTES = import.meta.glob("/src/handlers/**/[a-z[]*.(js|ts)", {
  eager: true,
});
const apiRoutes = Object.keys(API_ROUTES).map(
  (route) => API_ROUTES[route].default
);

const app = express();

app.get("/", (_req, res) => {
  res.send("Welcome to the Remixer API!");
});

apiRoutes?.map((route) => {
  app.use("/api/", route);
});

export const handler = app;
