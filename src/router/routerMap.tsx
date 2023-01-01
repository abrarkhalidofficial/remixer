import { Fragment } from "react";
import { Route } from "react-router-dom";

export const routerMap = ({
  path,
  element: Component = Fragment,
  loader,
  action,
}) => (
  <Route
    key={path}
    path={path}
    element={<Component />}
    loader={loader}
    action={action}
  />
);
