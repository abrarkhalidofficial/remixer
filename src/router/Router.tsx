import { Fragment, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { action } from "./action";
import { loader } from "./loader";
import { mapLazyRoutes } from "./mapLazyRoutes";
import { pathExtractor } from "./pathExtractor";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).(jsx|tsx)",
  { eager: true }
);

const ROUTES = import.meta.glob([
  "/src/screens/**/[a-z[]*.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.layout.(jsx|tsx)",
]);

const EAGER_ROUTES = import.meta.glob(
  [
    "/src/screens/**/[a-z[]*.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.layout.(jsx|tsx)",
  ],
  {
    eager: true,
  }
);
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.(jsx|tsx)");
const LAYOUT_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.layout.(jsx|tsx)"
);
const PROTECTED_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.protected.(jsx|tsx)"
);

const preserved = Object.keys(PRESERVED).reduce(
  (preserved, file) => ({
    ...preserved,
    [file.replace(/\/src\/layouts\/|\.jsx|\.tsx$/g, "")]:
      PRESERVED[file].default,
  }),
  {}
);
const eagerRoutes = Object.keys(EAGER_ROUTES).map((route) => {
  const module = ROUTES[route];
  return {
    path: pathExtractor(route),
    element: EAGER_ROUTES[route].default,
    loader: loader(module),
    action: action(module),
    preload: module,
  };
});
const lazyRoutes = mapLazyRoutes(LAZY_ROUTES, /\.lazy/, "");
const layoutRoutes = mapLazyRoutes(LAYOUT_ROUTES, /\.layout/, "/");
const protectedRoutes = mapLazyRoutes(PROTECTED_ROUTES, /\.protected/, "");

export const getMatchingRoute = (path: string) =>
  lazyRoutes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
  );

const routerMap = ({ path, element: Component = Fragment, loader, action }) =>
  layoutRoutes
    .map((route) => route.path.replace(".layout", ""))
    .includes(path) ? (
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
      })
  ) : (
    <Route
      key={path}
      path={path}
      element={<Component />}
      loader={loader}
      action={action}
    />
  );

if (
  Object.keys(ROUTES).length === 0 &&
  Object.keys(LAZY_ROUTES).length === 0 &&
  Object.keys(PROTECTED_ROUTES).length === 0
)
  console.error("No routes found");

if (!Object.keys(preserved).includes("notFound"))
  console.error("No 404 element found");

if (!Object.keys(preserved).includes("loading"))
  console.error("No loader function found");

if (!Object.keys(preserved).includes("protected"))
  console.error("No protected element found");

const App = preserved?.["app"] || Fragment;
const NotFound = preserved?.["notFound"] || Fragment;
const Loading = preserved?.["loading"] || Fragment;
const Protected = preserved?.["protected"] || Fragment;

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <Route path="/" element={<App />}>
              {eagerRoutes?.length > 0 && eagerRoutes?.map(routerMap)}
              {lazyRoutes?.length > 0 && lazyRoutes?.map(routerMap)}
              {protectedRoutes?.length > 0 && (
                <Route path="/" element={<Protected />}>
                  {protectedRoutes?.map(routerMap)}
                </Route>
              )}
              <Route path="*" element={<NotFound />} />
            </Route>
          )
        )}
      />
    </Suspense>
  );
}
