import { lazyRoutes } from "./Router";

export const getMatchingRoute = (path: string) =>
  lazyRoutes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
  );
