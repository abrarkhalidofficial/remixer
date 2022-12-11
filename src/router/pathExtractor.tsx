export const pathExtractor = (path: string) =>
  path
    .replace(/\/src\/screens|index|\.jsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .split("/")
    .filter((p) => !p.includes("_"))
    .join("/");
