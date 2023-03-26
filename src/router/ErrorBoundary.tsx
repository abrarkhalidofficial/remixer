export default (routes: any) =>
  async (...args: any) =>
    routes()
      .then((mod: { Error: any }) => mod?.Error)
      .then((res) => (res === undefined ? null : res?.(...args)));
