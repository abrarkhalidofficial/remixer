import { Link } from "router";
import { useLoaderData } from "react-router-dom";

export const loader = () => "data from loader";

export default function index() {
  const data = useLoaderData();

  return (
    <div>
      index
      {data}
      <Link to="/about">About</Link>
    </div>
  );
}
