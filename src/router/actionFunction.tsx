export function actionFunction(routes: any) {
  return async (...args) =>
    routes()
      .then((mod) => mod?.action)
      .then((res) => (res === undefined ? null : res?.(...args)));
}
