import { Footer, Header } from "components";

import { Outlet } from "react-router-dom";
import { SuperContext } from "react-super-context";
import { UserContext } from "contexts";

export default function App() {
  return (
    <SuperContext contexts={[UserContext]}>
      <Header />
      <Outlet />
      <Footer />
    </SuperContext>
  );
}
