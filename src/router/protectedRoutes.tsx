import { actionFunction } from "./actionFunction";
import { lazy } from "react";
import { loaderFunction } from "./loaderFunction";
import { pathExtractor } from "./pathExtractor";

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.protected.jsx"
);
export const protectedRoutes = Object.keys(PROTECTED_ROUTES).map((route) => {
  const module = ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.protected/, ""),
    component: lazy(PROTECTED_ROUTES[route]),
    loader: loaderFunction(module),
    action: actionFunction(module),
    preload: module,
  };
});
