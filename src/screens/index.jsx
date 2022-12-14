import { useLoaderData } from "react-router-dom";

export const loader = () => "index";

export default function Index() {
  const data = useLoaderData();
  return <div>{data}</div>;
}
