import React, { Fragment, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./layouts/_loading";

const PRESERVED = import.meta.globEager("/src/layouts/(_app|_notFound).jsx");
const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/layouts\/|\.jsx$/g, "");
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

export const routes = Object.keys(ROUTES).map((route) => {
  const path = route
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");
  return {
    path,
    component: lazy(ROUTES[route]),
    preload: ROUTES[route],
  };
});

export const Router = () => {
  const location = useLocation();
  const App = preserved?.["_app"] || Fragment;
  const NotFound = preserved?.["_notFound"] || Fragment;

  return (
    <Suspense fallback={<Loading />}>
      <App
        not404={
          routes.map((route) => route.path).includes(location.pathname) ||
          routes.map((route) => route.path).includes(location.pathname + "/")
        }
      >
        <Routes>
          {routes.map(({ path, component: Component = Fragment }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </App>
    </Suspense>
  );
};
