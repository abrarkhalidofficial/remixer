import { App, Loading, NotFound, Protected } from "./Preserved";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Suspense } from "react";
import { eagerRoutes } from "./EagerRoutes";
import { lazyRoutes } from "./LazyRoutes";
import { protectedRoutes } from "./ProtectedRoutes";

import.meta.glob("/src/styles/*.(scss|css)", { eager: true });

if (
  lazyRoutes.length === 0 &&
  eagerRoutes.length === 0 &&
  protectedRoutes.length === 0
)
  console.error("No routes found");

export default function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            Component: App,
            children: [
              ...eagerRoutes,
              ...lazyRoutes,
              { path: "", Component: Protected, children: protectedRoutes },
            ],
          },
          { path: "*", Component: NotFound },
        ])}
      />
    </Suspense>
  );
}
