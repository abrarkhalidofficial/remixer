import { Fragment } from "react";

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|error|protected).jsx",
  { eager: true }
);
const preserved = Object.keys(PRESERVED).reduce(
  (preserved, file) => ({
    ...preserved,
    [file.replace(/\/src\/layouts\/|\.jsx$/g, "")]: PRESERVED[file].default,
  }),
  {}
);

if (!Object.keys(PRESERVED).includes("/src/layouts/notFound.jsx"))
  console.error("No 404 element found");

if (!Object.keys(PRESERVED).includes("/src/layouts/loading.jsx"))
  console.error("No loader function found");

if (!Object.keys(PRESERVED).includes("/src/layouts/error.jsx"))
  console.error("No error element found");

if (!Object.keys(PRESERVED).includes("/src/layouts/protected.jsx"))
  console.error("No protected element found");

export const App = preserved?.["app"] || Fragment;
export const NotFound = preserved?.["notFound"] || Fragment;
export const Loading = preserved?.["loading"] || Fragment;
export const Error = preserved?.["error"] || Fragment;
export const Protected = preserved?.["protected"] || Fragment;
