import { Route } from "react-router-dom";
import { layoutRoutes } from "./Router";

export const routerMapParent = (
  path: any,
  Component: any,
  loader: any,
  action: any
) =>
  layoutRoutes
    .filter((route) => route.path === path)
    .map((route) => {
      let ParentComponent = route.element;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<ParentComponent />}
          loader={route.loader}
          action={route.action}
        >
          <Route
            key={path}
            path={path}
            element={<Component />}
            loader={loader}
            action={action}
          />
        </Route>
      );
    });
