import { Footer, Header } from "components";

import { Head } from "router";
import { Outlet } from "react-router-dom";

export default function App() {
  const title = "Remixer";
  const description = "Remixer";
  const image = "/favicon.svg";
  const url = "https://vitefilerouter.com";
  return (
    <>
      <Head title={title} image={image} url={url} description={description} />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
