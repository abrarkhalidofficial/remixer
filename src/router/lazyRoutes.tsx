import { actionFunction } from "./actionFunction";
import { lazy } from "react";
import { loaderFunction } from "./loaderFunction";
import { pathExtractor } from "./pathExtractor";

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.jsx");

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const module = ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.lazy/, ""),
    component: lazy(LAZY_ROUTES[route]),
    loader: loaderFunction(module),
    action: actionFunction(module),
    preload: module,
  };
});
