import React, { Fragment, lazy, Suspense } from "react";
import { withStyles } from "react-critical-css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const PRESERVED = import.meta.globEager(
  "/src/layouts/(app|notFound|loading).jsx"
);
const EAGER_ROUTES = import.meta.globEager("/src/screens/**/[a-z[]*.jsx");
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.jsx");
const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");
const STYLES = import.meta.globEager("/src/styles/*.scss");

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/layouts\/|\.jsx$/g, "");
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

export const eagerRoutes = Object.keys(EAGER_ROUTES)
  .filter((route) => !route.includes(".lazy"))
  .map((route) => {
    const routes = ROUTES[route];
    const path = route
      .replace(/\/src\/screens|index|\.jsx$/g, "")
      .replace(/\[\.{3}.+\]/, "*")
      .replace(/\[(.+)\]/, ":$1");

    return {
      path,
      component: EAGER_ROUTES[route].default,
      loader: (...args) => routes().then((mod) => mod?.loader?.(...args)),
      preload: ROUTES[route],
    };
  });

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const routes = ROUTES[route];
  const path = route
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .replace(/\.lazy/, "");
  return {
    path,
    component: lazy(LAZY_ROUTES[route]),
    loader: (...args) => routes().then((mod) => mod?.loader?.(...args)),
    preload: ROUTES[route],
  };
});

if (Object.keys(STYLES).length === 0) {
  console.error("No styles found");
}
if (Object.keys(ROUTES).length === 0) {
  console.error("No routes found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/notFound.jsx")) {
  console.error("No 404 found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/loading.jsx")) {
  console.error("No loader found");
}

const Router = () => {
  const App = preserved?.["app"] || Fragment;
  const NotFound = preserved?.["notFound"] || Fragment;
  const Loading = preserved?.["loading"] || Fragment;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <App
            not404={
              lazyRoutes
                .map((route) => route.path)
                .includes(window.location.pathname) ||
              lazyRoutes
                .map((route) => route.path)
                .includes(window.location.pathname + "/") ||
              eagerRoutes
                .map((route) => route.path)
                .includes(window.location.pathname) ||
              eagerRoutes
                .map((route) => route.path)
                .includes(window.location.pathname + "/")
            }
          />
        }
      >
        {eagerRoutes?.map(
          ({ path, component: Component = Fragment, loader }) => {
            return (
              <Route
                key={path}
                path={path}
                element={<Component />}
                loader={loader}
              />
            );
          }
        )}
        {lazyRoutes.map(({ path, component: Component = Fragment, loader }) => {
          return (
            <Route
              key={path}
              path={path}
              element={<Component />}
              loader={loader}
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default withStyles(STYLES)(Router);
