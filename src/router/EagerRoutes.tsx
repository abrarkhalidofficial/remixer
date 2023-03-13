import RoutesReducer from "./RoutesReducer";

const ROUTES = import.meta.glob([
  "/src/screens/**/*.(jsx|tsx)",
  "!/src/screens/**/*.lazy.(jsx|tsx)",
  "!/src/screens/**/*.protected.(jsx|tsx)",
]);
const EAGER_ROUTES = import.meta.glob(
  [
    "/src/screens/**/*.(jsx|tsx)",
    "!/src/screens/**/*.lazy.(jsx|tsx)",
    "!/src/screens/**/*.protected.(jsx|tsx)",
  ],
  {
    eager: true,
  }
);

export const eagerRoutes = RoutesReducer(EAGER_ROUTES, ROUTES);
