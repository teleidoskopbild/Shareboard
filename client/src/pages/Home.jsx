import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Shareboard!</h1>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/selectboard">
          <button>Create a Board</button>
        </Link>
      </div>
    </div>
  );
}
