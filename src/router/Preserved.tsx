import { Fragment } from "react";

const PRESERVED = import.meta.glob(
  "/src/layouts/(App|NotFound|Loading|Protected).(jsx|tsx)",
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

if (!Object.keys(preserved).includes("NotFound"))
  console.error("No 404 element found");
if (!Object.keys(preserved).includes("Loading"))
  console.error("No loader function found");
if (!Object.keys(preserved).includes("Protected"))
  console.error("No protected element found");

export const App = preserved?.["App"] || Fragment;
export const NotFound = preserved?.["NotFound"] || Fragment;
export const Loading = preserved?.["Loading"] || Fragment;
export const Protected = preserved?.["Protected"] || Fragment;
