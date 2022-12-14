import { Fragment, Suspense, lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Partytown } from "@builder.io/partytown/react";

const pathExtractor = (path: string) =>
  path
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .split("/")
    .filter((p) => !p.includes("_"))
    .join("/");

function actionFunction(routes: any) {
  return async (...args) =>
    routes()
      .then((mod) => mod?.action)
      .then((res) => (res === undefined ? null : res?.(...args)));
}

function loaderFunction(routes: any) {
  return async (...args) =>
    routes()
      .then((mod) => mod?.loader)
      .then((res) => (res === undefined ? null : res?.(...args)));
}

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const EAGER_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx", {
  eager: true,
});
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.jsx");
const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.protected.jsx"
);

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).jsx",
  { eager: true }
);
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

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const module = LAZY_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.lazy/, ""),
    component: lazy(module),
    loader: loaderFunction(module),
    action: actionFunction(module),
    preload: module,
  };
});

export const protectedRoutes = Object.keys(PROTECTED_ROUTES).map((route) => {
  const module = PROTECTED_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.protected/, ""),
    component: lazy(module),
    loader: loaderFunction(module),
    action: actionFunction(module),
    preload: module,
  };
});

const routes = [...eagerRoutes, ...lazyRoutes];

if (Object.keys(ROUTES).length === 0) console.error("No routes found");

if (!Object.keys(PRESERVED).includes("/src/layouts/notFound.jsx"))
  console.error("No 404 element found");

if (!Object.keys(PRESERVED).includes("/src/layouts/loading.jsx"))
  console.error("No loader function found");

if (!Object.keys(PRESERVED).includes("/src/layouts/protected.jsx"))
  console.error("No protected element found");

const App = preserved?.["app"] || Fragment;
const NotFound = preserved?.["notFound"] || Fragment;
const Loading = preserved?.["loading"] || Fragment;
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
