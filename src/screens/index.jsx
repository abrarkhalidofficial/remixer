import { Head, Link } from "router";

import { useLoaderData } from "react-router-dom";
import { useUserContext } from "contexts";

export const loader = async () => {
  return "data from loader";
};

export default function Index() {
  const data = useLoaderData();
  const [user, setUser] = useUserContext();
  return (
    <div>
      <Head title="Home | Demo Template" description="Home | Demo Template" />
      <div>
        {data}
        {user}
      </div>
      <Link
        to="/about"
        onClick={() => {
          setUser("user");
        }}
      >
        About
      </Link>
    </div>
  );
}
