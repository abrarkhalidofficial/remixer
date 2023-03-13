import RoutesReducer from "./RoutesReducer";

export const LAZY_ROUTES = import.meta.glob("/src/screens/**/*.lazy.(jsx|tsx)");
export const lazyRoutes = RoutesReducer(null, LAZY_ROUTES);
export const getMatchingRoute = (path: string) =>
  lazyRoutes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
  );
