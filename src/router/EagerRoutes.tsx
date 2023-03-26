import RoutesReducer from "./RoutesReducer";

const ROUTES = import.meta.glob([
  "/src/screens/**/*.(jsx|tsx)",
  "!/src/screens/**/*.lazy.(jsx|tsx)",
]);
const EAGER_ROUTES = import.meta.glob(
  ["/src/screens/**/*.(jsx|tsx)", "!/src/screens/**/*.lazy.(jsx|tsx)"],
  {
    eager: true,
  }
);

export default RoutesReducer(EAGER_ROUTES, ROUTES);
