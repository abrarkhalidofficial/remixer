import { Fragment, Suspense, lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Partytown } from "@builder.io/partytown/react";
import { actionFunction } from "./actionFunction";
import { loaderFunction } from "./loaderFunction";
import { pathExtractor } from "./pathExtractor";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|error|protected).jsx",
  { eager: true }
);

const EAGER_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx", {
  eager: true,
});

const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.jsx");

const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.protected.jsx"
);

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const preserved = Object.keys(PRESERVED).reduce(
  (preserved, file) => ({
    ...preserved,
    [file.replace(/\/src\/layouts\/|\.jsx$/g, "")]: PRESERVED[file].default,
  }),
  {}
);

const eagerRoutes = Object.keys(EAGER_ROUTES)
  .filter((route) => !route.includes(".lazy"))
  .filter((route) => !route.includes(".protected"))
  .map((route) => ({
    path: pathExtractor(route),
    component: EAGER_ROUTES[route].default,
    loader: loaderFunction(ROUTES[route]),
    action: actionFunction(ROUTES[route]),
    preload: ROUTES[route],
  }));

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => ({
  path: pathExtractor(route).replace(/\.lazy/, ""),
  component: lazy(LAZY_ROUTES[route]),
  loader: loaderFunction(ROUTES[route]),
  action: actionFunction(ROUTES[route]),
  preload: ROUTES[route],
}));

const protectedRoutes = Object.keys(PROTECTED_ROUTES).map((route) => ({
  path: pathExtractor(route).replace(/\.protected/, ""),
  component: lazy(PROTECTED_ROUTES[route]),
  loader: loaderFunction(ROUTES[route]),
  action: actionFunction(ROUTES[route]),
  preload: ROUTES[route],
}));

const routes = [...eagerRoutes, ...lazyRoutes];

if (Object.keys(ROUTES).length === 0) console.error("No routes found");

if (!Object.keys(PRESERVED).includes("/src/layouts/notFound.jsx"))
  console.error("No 404 element found");

if (!Object.keys(PRESERVED).includes("/src/layouts/loading.jsx"))
  console.error("No loader function found");

if (!Object.keys(PRESERVED).includes("/src/layouts/error.jsx"))
  console.error("No error element found");

if (!Object.keys(PRESERVED).includes("/src/layouts/protected.jsx"))
  console.error("No protected element found");

const App = preserved?.["app"] || Fragment;
const NotFound = preserved?.["notFound"] || Fragment;
const Loading = preserved?.["loading"] || Fragment;
const Error = preserved?.["error"] || Fragment;
const Protected = preserved?.["protected"] || Fragment;

const Router = () => (
  <Suspense fallback={<Loading />}>
    <Partytown debug={true} forward={["dataLayer.push"]} />
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            {routes?.map(
              ({ path, component: Component = Fragment, loader, action }) => {
                return (
                  <Route
                    key={path}
                    path={path}
                    element={<Component />}
                    loader={loader}
                    action={action}
                    errorElement={<Error />}
                  />
                );
              }
            )}
            <Route path="/" element={<Protected />}>
              {protectedRoutes?.map(
                ({ path, component: Component = Fragment, loader, action }) => {
                  return (
                    <Route
                      key={path}
                      path={path}
                      element={<Component />}
                      loader={loader}
                      action={action}
                      errorElement={<Error />}
                    />
                  );
                }
              )}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      )}
    />
  </Suspense>
);

export default Router;
