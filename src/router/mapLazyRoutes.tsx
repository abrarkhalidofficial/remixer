import { action } from "./action";
import { lazy } from "react";
import { loader } from "./loader";
import { pathExtractor } from "./pathExtractor";

export const mapLazyRoutes = (
  routes: Record<string, () => Promise<unknown>>,
  replaceString: RegExp
) =>
  Object.keys(routes).map((route) => {
    const module = routes[route];
    return {
      path: pathExtractor(route).replace(replaceString, ""),
      element: lazy(module),
      loader: loader(module),
      action: action(module),
      preload: module,
    };
  });
