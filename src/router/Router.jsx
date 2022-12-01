import { Fragment, Suspense, lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { withStyles } from "react-critical-css";

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|error).jsx",
  {
    eager: true,
  }
);
const EAGER_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx", {
  eager: true,
});
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.jsx");
const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");
const STYLES = import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/layouts\/|\.jsx$/g, "");
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

const eagerRoutes = Object.keys(EAGER_ROUTES)
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
      loader: async (...args) => routes().then((mod) => mod?.loader?.(...args)),
      action: async (...args) => routes().then((mod) => mod?.action?.(...args)),
      preload: ROUTES[route],
    };
  });

const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const routes = ROUTES[route];
  const path = route
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .replace(/\.lazy/, "");

  return {
    path,
    component: lazy(LAZY_ROUTES[route]),
    loader: async (...args) => routes().then((mod) => mod?.loader?.(...args)),
    action: async (...args) => routes().then((mod) => mod?.action?.(...args)),
    preload: ROUTES[route],
  };
});

const routes = [...eagerRoutes, ...lazyRoutes];

export const getMatchingRoute = (path) => {
  return routes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
  );
};

if (Object.keys(STYLES).length === 0) {
  console.error("No styles found");
}
if (Object.keys(ROUTES).length === 0) {
  console.error("No routes found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/notFound.jsx")) {
  console.error("No 404 element found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/loading.jsx")) {
  console.error("No loader function found");
}
if (!Object.keys(PRESERVED).includes("/src/layouts/error.jsx")) {
  console.error("No error element found");
}

const Router = () => {
  const App = preserved?.["app"] || Fragment;
  const NotFound = preserved?.["notFound"] || Fragment;
  const Loading = preserved?.["loading"] || Fragment;
  const Error = preserved?.["error"] || Fragment;

  return (
    <Suspense fallback={<Loading />}>
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
              <Route path="*" element={<NotFound />} />
            </Route>
          )
        )}
      />
    </Suspense>
  );
};

export default withStyles(STYLES)(Router);
