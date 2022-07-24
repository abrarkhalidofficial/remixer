import React from "react";
import useSWR from "swr";
import { Link } from "../Components/Link";
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
      <Link to="/">Home</Link>
      <ul>
        {data.map((repo) => (
          <li key={repo.id}>{JSON.stringify(repo)}</li>
        ))}
      </ul>
    </div>
  );
}
