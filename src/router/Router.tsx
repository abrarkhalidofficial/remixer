import { App, Error, Loading, NotFound, Protected } from "./preservedRoutes";
import { Fragment, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Partytown } from "@builder.io/partytown/react";
import { eagerRoutes } from "./eagerRoutes";
import { lazyRoutes } from "./lazyRoutes";
import { protectedRoutes } from "./protectedRoutes";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

const ROUTES = import.meta.glob("/src/screens/**/[a-z[]*.jsx");

const routes = [...eagerRoutes, ...lazyRoutes];

if (Object.keys(ROUTES).length === 0) console.error("No routes found");

const Router = () => (
  <Suspense fallback={<Loading />}>
    <Partytown debug={true} forward={["dataLayer.push"]} />
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
            <Route path="/" element={<Protected />}>
              {protectedRoutes?.map(
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        )
      )}
    />
  </Suspense>
);

export default Router;
