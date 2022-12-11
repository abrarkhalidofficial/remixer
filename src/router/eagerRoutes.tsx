import { actionFunction } from "./actionFunction";
import { loaderFunction } from "./loaderFunction";
import { pathExtractor } from "./pathExtractor";

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const EAGER_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx", {
  eager: true,
});

export const eagerRoutes = Object.keys(EAGER_ROUTES)
  .filter((route) => !route.includes(".lazy"))
  .filter((route) => !route.includes(".protected"))
  .map((route) => {
    const module = ROUTES[route];
    return {
      path: pathExtractor(route),
      component: EAGER_ROUTES[route].default,
      loader: loaderFunction(module),
      action: actionFunction(module),
      preload: module,
    };
  });
