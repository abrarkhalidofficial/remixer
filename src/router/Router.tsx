import { Fragment, Suspense, lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { action } from "./action";
import { loader } from "./loader";
import { pathExtractor } from "./pathExtractor";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).(jsx|tsx)",
  { eager: true }
);

const ROUTES = import.meta.glob([
  "/src/screens/**/[a-z[]*.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
]);

const EAGER_ROUTES = import.meta.glob(
  [
    "/src/screens/**/[a-z[]*.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
  ],
  {
    eager: true,
  }
);
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.(jsx|tsx)");
const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.protected.(jsx|tsx)"
);

const preserved = Object.keys(PRESERVED).reduce(
  (preserved, file) => ({
    ...preserved,
    [file.replace(/\/src\/layouts\/|\.jsx|\.tsx$/g, "")]:
      PRESERVED[file].default,
  }),
  {}
);

const eagerRoutes = Object.keys(EAGER_ROUTES).map((route) => {
  const module = ROUTES[route];
  return {
    path: pathExtractor(route),
    element: EAGER_ROUTES[route].default,
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const module = LAZY_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.lazy/, ""),
    element: lazy(module),
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});

const protectedRoutes = Object.keys(PROTECTED_ROUTES).map((route) => {
  const module = PROTECTED_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.protected/, ""),
    element: lazy(module),
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});

if (
  Object.keys(ROUTES).length === 0 &&
  Object.keys(LAZY_ROUTES).length === 0 &&
  Object.keys(PROTECTED_ROUTES).length === 0
)
  console.error("No routes found");

if (!Object.keys(preserved).includes("notFound"))
  console.error("No 404 element found");

if (!Object.keys(preserved).includes("loading"))
  console.error("No loader function found");

if (!Object.keys(preserved).includes("protected"))
  console.error("No protected element found");

const App = preserved?.["app"] || Fragment;
const NotFound = preserved?.["notFound"] || Fragment;
const Loading = preserved?.["loading"] || Fragment;
const Protected = preserved?.["protected"] || Fragment;

const routerMap = ({ path, element: Component = Fragment, loader, action }) => (
  <Route
    key={path}
    path={path}
    element={<Component />}
    loader={loader}
    action={action}
  />
);

const Router = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            {eagerRoutes?.length > 0 && eagerRoutes?.map(routerMap)}
            {lazyRoutes?.length > 0 && lazyRoutes?.map(routerMap)}
            {protectedRoutes?.length > 0 && (
              <Route path="/" element={<Protected />}>
                {protectedRoutes?.map(routerMap)}
              </Route>
            )}
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      )}
    />
  </Suspense>
);

export default Router;
