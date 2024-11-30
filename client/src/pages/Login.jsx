import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [key, setKey] = useState("");

  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <div>
          <label htmlFor="key">Key eingeben:</label>
          <input
            id="key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="z. B. tm9ckk0gk"
            required
          />
        </div>

        {key.trim() && (
          <Link to={`/board/${key}`}>
            <button type="button">Zum Board</button>
          </Link>
        )}
      </form>
    </div>
  );
}
