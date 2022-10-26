import React, { Fragment, lazy, Suspense } from "react";
import { withStyles } from "react-critical-css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const PRESERVED = import.meta.globEager(
  "/src/layouts/(_app|_notFound|_loading).jsx"
);
const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");
const STYLES = import.meta.globEager("/src/styles/*.scss");

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/layouts\/|\.jsx$/g, "");
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

export const routes = Object.keys(ROUTES).map((route) => {
  const routes = ROUTES[route];
  const path = route
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");
  return {
    path,
    component: lazy(ROUTES[route]),
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
if (!Object.keys(PRESERVED).includes("/src/layouts/_notFound.jsx")) {
  console.error("No 404 found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/_loading.jsx")) {
  console.error("No loader found");
}
const Router = () => {
  const App = preserved?.["_app"] || Fragment;
  const NotFound = preserved?.["_notFound"] || Fragment;
  const Loading = preserved?.["_loading"] || Fragment;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {routes.map(({ path, component: Component = Fragment, loader }) => {
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
      </>
    )
  );

  return (
    <Suspense fallback={<Loading />}>
      <App
        not404={
          routes
            .map((route) => route.path)
            .includes(window.location.pathname) ||
          routes
            .map((route) => route.path)
            .includes(window.location.pathname + "/")
        }
      >
        <RouterProvider router={router} />
      </App>
    </Suspense>
  );
};

export default withStyles(STYLES)(Router);
