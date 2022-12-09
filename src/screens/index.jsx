import { Head, Link } from "router";

import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  return "data from loader";
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <Head title="Home | Demo Template" description="Home | Demo Template" />
      <div>{data}</div>
      <Link to="/about">About</Link>
    </div>
  );
}
