export function loaderFunction(routes: any) {
  return async (...args) =>
    routes()
      .then((mod) => mod?.loader)
      .then((res) => (res === undefined ? null : res?.(...args)));
}
