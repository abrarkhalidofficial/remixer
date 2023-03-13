import RoutesReducer from "./RoutesReducer";

const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/*.protected.(jsx|tsx)"
);

export const protectedRoutes = RoutesReducer(null, PROTECTED_ROUTES);
