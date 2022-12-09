import { Link } from "react-router-dom";

export const loader = () => null;

export default function About() {
  return (
    <div>
      about
      <Link to="/">Home</Link>
    </div>
  );
}
