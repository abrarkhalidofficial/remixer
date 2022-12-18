export const action = (routes: any) => {
  return async (...args: any) =>
    routes()
      .then((mod: { action: any }) => mod?.action)
      .then((res) => (res === undefined ? null : res?.(...args)));
};
