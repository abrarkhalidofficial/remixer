import { Fragment, Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { action } from "./action";
import { loader } from "./loader";

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
const eagerRoutes = Object.keys(EAGER_ROUTES).reduce((routes, key) => {
  const module = ROUTES[key];

  const Component = EAGER_ROUTES[key].default || Fragment;

  const route: Route = {
    element: <Component />,
    loader: loader(module),
    action: action(module),
    preload: module,
  };

  const segments = key
    .replace(/\/src\/screens|\.jsx|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .split("/")
    .filter((p) => !p.includes("_"))
    .filter(Boolean);

  segments.reduce((parent, segment, index) => {
    const path = segment.replace(/index|\./g, "");
    const root = index === 0;
    const leaf = index === segments.length - 1 && segments.length > 1;
    const node = !root && !leaf;
    const insert = /^\w|\//.test(path) ? "unshift" : "push";

    if (root) {
      const dynamic = path.startsWith("[") || path === "*";
      if (dynamic) return parent;

      const last = segments.length === 1;
      if (last) {
        routes.push({ path, ...route });
        return parent;
      }
    }
    if (root || node) {
      const current = root ? routes : parent.children;
      const found = current?.find((route) => route.path === path);
      if (found) found.children ??= [];
      else
        current?.[insert]({
          path: path,
          children: [],
        });
      return found || current?.[insert === "unshift" ? 0 : current.length - 1];
    }

    if (leaf) {
      parent?.children?.[insert]({
        path: path.replace(/\/$/, ""),
        ...route,
      });
    }

    return parent;
  }, {});

  return routes;
}, []);
const lazyRoutes = Object.keys(LAZY_ROUTES).reduce((routes, key) => {
  const module = LAZY_ROUTES[key];

  const Component = lazy(module) || Fragment;
  console.log(Component);
  const route: Route = {
    element: <Component />,
    loader: loader(module),
    action: action(module),
    preload: module,
  };

  const segments = key
    .replace(/\/src\/screens|\.jsx|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .replace(/\.lazy/, "")
    .split("/")
    .filter((p) => !p.includes("_"))
    .filter(Boolean);

  segments.reduce((parent, segment, index) => {
    const path = segment.replace(/index|\./g, "");
    const root = index === 0;
    const leaf = index === segments.length - 1 && segments.length > 1;
    const node = !root && !leaf;
    const insert = /^\w|\//.test(path) ? "unshift" : "push";

    if (root) {
      const dynamic = path.startsWith("[") || path === "*";
      if (dynamic) return parent;

      const last = segments.length === 1;
      if (last) {
        routes.push({ path, ...route });
        return parent;
      }
    }
    if (root || node) {
      const current = root ? routes : parent.children;
      const found = current?.find((route) => route.path === path);
      if (found) found.children ??= [];
      else
        current?.[insert]({
          path: path,
          children: [],
        });
      return found || current?.[insert === "unshift" ? 0 : current.length - 1];
    }

    if (leaf) {
      parent?.children?.[insert]({
        path: path.replace(/\/$/, ""),
        ...route,
      });
    }

    return parent;
  }, {});

  return routes;
}, []);
const protectedRoutes = Object.keys(PROTECTED_ROUTES).reduce((routes, key) => {
  const module = PROTECTED_ROUTES[key];

  const Component = lazy(module) || Fragment;

  const route: Route = {
    element: <Component />,
    loader: loader(module),
    action: action(module),
    preload: module,
  };

  const segments = key
    .replace(/\/src\/screens|\.jsx|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .replace(/\.protected/, "")
    .split("/")
    .filter((p) => !p.includes("_"))
    .filter(Boolean);

  segments.reduce((parent, segment, index) => {
    const path = segment.replace(/index|\./g, "");
    const root = index === 0;
    const leaf = index === segments.length - 1 && segments.length > 1;
    const node = !root && !leaf;
    const insert = /^\w|\//.test(path) ? "unshift" : "push";

    if (root) {
      const dynamic = path.startsWith("[") || path === "*";
      if (dynamic) return parent;

      const last = segments.length === 1;
      if (last) {
        routes.push({ path, ...route });
        return parent;
      }
    }
    if (root || node) {
      const current = root ? routes : parent.children;
      const found = current?.find((route) => route.path === path);
      if (found) found.children ??= [];
      else
        current?.[insert]({
          path: path,
          children: [],
        });
      return found || current?.[insert === "unshift" ? 0 : current.length - 1];
    }

    if (leaf) {
      parent?.children?.[insert]({
        path: path.replace(/\/$/, ""),
        ...route,
      });
    }

    return parent;
  }, {});

  return routes;
}, []);

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

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
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
