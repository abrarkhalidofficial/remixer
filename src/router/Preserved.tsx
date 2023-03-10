import { Fragment } from "react";

const PRESERVED = import.meta.glob(
  "/src/layouts/(app|notFound|loading|protected).(jsx|tsx)",
  { eager: true }
);

const preserved = Object.keys(PRESERVED).reduce(
  (preserved, file) => ({
    ...preserved,
    [file.replace(/\/src\/layouts\/|\.jsx|\.tsx$/g, "")]:
      PRESERVED[file].default,
  }),
  {}
);

if (!Object.keys(preserved).includes("notFound"))
  console.error("No 404 element found");
if (!Object.keys(preserved).includes("loading"))
  console.error("No loader function found");
if (!Object.keys(preserved).includes("protected"))
  console.error("No protected element found");

export const App = preserved?.["app"] || Fragment;
export const NotFound = preserved?.["notFound"] || Fragment;
export const Loading = preserved?.["loading"] || Fragment;
export const Protected = preserved?.["protected"] || Fragment;
