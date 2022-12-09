import { Link } from "router";
import { useUserContext } from "contexts";

export default function About() {
  const [user] = useUserContext();
  return (
    <div>
      about{user}
      <Link to="/">Home</Link>
    </div>
  );
}
