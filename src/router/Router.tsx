import { Fragment, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Head from "./Head";
import { meta } from "../layouts/app";
import routesReducer from "./routesReducer";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).(jsx|tsx)",
  { eager: true }
);
const ROUTES = import.meta.glob([
  "/src/screens/**/[a-z[]*.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
  "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
]);
const EAGER_ROUTES = import.meta.glob(
  [
    "/src/screens/**/[a-z[]*.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.lazy.(jsx|tsx)",
    "!/src/screens/**/[a-z[]*.protected.(jsx|tsx)",
  ],
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
const eagerRoutes = routesReducer(EAGER_ROUTES, ROUTES);
const lazyRoutes = routesReducer(null, LAZY_ROUTES);
const protectedRoutes = routesReducer(null, PROTECTED_ROUTES);

export const getMatchingRoute = (path: string) =>
  lazyRoutes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
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

const { title, image, url, description } = meta;

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Head title={title} image={image} url={url} description={description} />
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: <App />,
            children: [
              ...eagerRoutes,
              ...lazyRoutes,
              { path: "", element: <Protected />, children: protectedRoutes },
            ],
          },
          { path: "*", element: <NotFound /> },
        ])}
      />
    </Suspense>
  );
}
