import { Link } from "router";

export default function About() {
  return (
    <div>
      about
      <Link to="/">Home</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
}
