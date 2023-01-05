import { action } from "./action";
import { lazy } from "react";
import { loader } from "./loader";
import { pathExtractor } from "./pathExtractor";

export const mapLazyRoutes = (
  routes: Record<string, () => Promise<unknown>>,
  replaceString: RegExp,
  replaceWith: string
) =>
  Object.keys(routes).map((route) => {
    const module = routes[route];
    return {
      path: pathExtractor(route).replace(replaceString, replaceWith),
      element: lazy(module),
      loader: loader(module),
      action: action(module),
      preload: module,
    };
  });
