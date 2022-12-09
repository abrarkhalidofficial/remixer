import { Link } from "router";
import { useAtom } from "jotai";
import { useLoaderData } from "react-router-dom";
import { userAtom } from "global";

export const loader = () => "data from loader";

export default function index() {
  const data = useLoaderData();
  const [user] = useAtom(userAtom);
  return (
    <div>
      index
      {data}
      {user}
      <Link to="/about">About</Link>
    </div>
  );
}
