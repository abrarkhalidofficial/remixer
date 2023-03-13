import { Footer, Header } from "@components";
import { Head, Outlet } from "@router";

export default function App() {
  return (
    <>
      <Head
        title="Remixer"
        image="/favicon.svg"
        url="https://vitefilerouter.com"
        description="Remixer"
      />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}