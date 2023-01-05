import { Footer, Header } from "components";

import { Head } from "router";
import { Outlet } from "react-router-dom";

export default function App() {
  const title = "Vite file router";
  const description = "Vite file router";
  const image = "/vite.svg";
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
