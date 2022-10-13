import React, { Fragment, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loading } from "../src/components/Loading";

const PRESERVED = import.meta.globEager("/src/screens/(_app|404).jsx");
const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/screens\/|\.jsx$/g, "");
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

export const routes = Object.keys(ROUTES).map((route) => {
  const path = route
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");

  return { path, component: lazy(ROUTES[route]), preload: ROUTES[route] };
});

export const Router = () => {
  const App = preserved?.["_app"] || Fragment;
  const NotFound = preserved?.["404"] || Fragment;

  return (
    <Suspense fallback={<Loading />}>
      <App>
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
