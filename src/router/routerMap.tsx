import { Fragment } from "react";
import { Route } from "react-router-dom";
import { layoutRoutes } from "./Router";
import { routerMapParent } from "./routerMapParent";

export const routerMap = ({
  path,
  element: Component = Fragment,
  loader,
  action,
}) =>
  layoutRoutes
    .map((route) => route.path.replace(".layout", ""))
    .includes(path) ? (
    routerMapParent(path, Component, loader, action)
  ) : (
    <Route
      key={path}
      path={path}
      element={<Component />}
      loader={loader}
      action={action}
    />
  );
