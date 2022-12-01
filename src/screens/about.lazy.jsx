import { Head } from "router";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  return "about from loader";
};

export default function Lazy() {
  const data = useLoaderData();
  return (
    <div>
      <Head title="About | Demo Template" description="Home | Demo Template" />
      <div>{data}</div>
    </div>
  );
}
