import { ROUTES } from "./Router";
import { action } from "./action";
import { loader } from "./loader";
import { pathExtractor } from "./pathExtractor";

export const mapEagerRoutes = (
  routes: Record<string, unknown>,
  replaceString: RegExp
) =>
  Object.keys(routes).map((route) => {
    const module = ROUTES[route];
    return {
      path: pathExtractor(route).replace(replaceString, "/"),
      element: routes[route].default,
      loader: loader(module),
      action: action(module),
      preload: module,
    };
  });
