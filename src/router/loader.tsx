export const loader = (routes: any) => {
  return async (...args: any) =>
    routes()
      .then((mod: { loader: any }) => mod?.loader)
      .then((res) => (res === undefined ? null : res?.(...args)));
};
