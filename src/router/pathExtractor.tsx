export const pathExtractor = (path: string) => {
  return path
    .replace(/\/src\/screens|index|\.jsx|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")
    .split("/")
    .filter((p) => !p.includes("_"))
    .join("/");
};
