import { Fragment, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { mapEagerRoutes } from "./mapEagerRoutes";
import { mapLazyRoutes } from "./mapLazyRoutes";
import { routerMap } from "./routerMap";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).(jsx|tsx)",
  { eager: true }
);

export const ROUTES = import.meta.glob([
  "/src/screens/**/[a-z[]*.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
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
const LAYOUT_ROUTES = import.meta.glob(
  "/src/screens/**/[a-z[]*.layout.(jsx|tsx)",
  {
    eager: true,
  }
);
const LAZY_ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.lazy.(jsx|tsx)");
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

export const lazyRoutes = mapLazyRoutes(LAZY_ROUTES, /\.lazy/);
const eagerRoutes = mapEagerRoutes(EAGER_ROUTES, /\.jsx|\.tsx/);
export const layoutRoutes = mapEagerRoutes(LAYOUT_ROUTES, /\.layout/);
const protectedRoutes = mapLazyRoutes(PROTECTED_ROUTES, /\.protected/);

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
