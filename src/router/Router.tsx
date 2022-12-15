import { Fragment, Suspense, lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const pathExtractor = (path: string) => {
  return path
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .split("/")
    .filter((p) => !p.includes("_"))
    .join("/");
};

const action = (routes: any) => {
  return async (...args: any) =>
    routes()
      .then((mod: { action: any }) => mod?.action)
      .then((res) => (res === undefined ? null : res?.(...args)));
};

const loader = (routes: any) => {
  return async (...args: any) =>
    routes()
      .then((mod: { loader: any }) => mod?.loader)
      .then((res) => (res === undefined ? null : res?.(...args)));
};

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*[^.lazy][^.protected].jsx"
);

const EAGER_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*[^.lazy][^.protected].jsx",
  {
    eager: true,
  }
);
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
      loader: loader(module),
      action: action(module),
      preload: module,
    };
  });

export const lazyRoutes = Object.keys(LAZY_ROUTES).map((route) => {
  const module = LAZY_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.lazy/, ""),
    component: lazy(module),
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});

const protectedRoutes = Object.keys(PROTECTED_ROUTES).map((route) => {
  const module = PROTECTED_ROUTES[route];
  return {
    path: pathExtractor(route).replace(/\.protected/, ""),
    component: lazy(module),
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});

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
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            {eagerRoutes?.length > 0 &&
              eagerRoutes?.map(
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
            {lazyRoutes?.length > 0 &&
              lazyRoutes?.map(
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
            {protectedRoutes?.length > 0 && (
              <Route path="/" element={<Protected />}>
                {protectedRoutes?.map(
                  ({
                    path,
                    component: Component = Fragment,
                    loader,
                    action,
                  }) => {
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
            )}
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      )}
    />
  </Suspense>
);

export default Router;
