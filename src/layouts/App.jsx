import Footer from "@components/Footer";
import Head from "@router/Head";
import Header from "@components/Header";
import Outlet from "@router/Outlet";

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
