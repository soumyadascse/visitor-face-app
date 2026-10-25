import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
      bg-blue-600
      text-white
      p-4
      flex
      justify-between
      "
    >
      <h2 className="font-bold">Visitor AI</h2>

      <div className="space-x-4">
        <Link to="/">Home</Link>

        <Link to="/register">Register</Link>

        <Link to="/history">History</Link>

        <Link to="/visit-logs">Visit Logs</Link>
      </div>
    </nav>
  );
}
