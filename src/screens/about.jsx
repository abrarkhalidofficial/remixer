import React from "react";
import useSWR from "swr";
import { Link } from "../components/Link";
import { fetcher } from "../utils/fetcher";

export default function about() {
  const { data } = useSWR(
    "https://api.github.com/users/MehfoozurRehman/repos",
    fetcher,
    { suspense: true }
  );
  return (
    <div>
      about
      <Link to="/" as="NavLink">
        Home
      </Link>
      <ul>
        {data.map((repo) => (
          <li key={repo.id}>{JSON.stringify(repo)}</li>
        ))}
      </ul>
    </div>
  );
}
