import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      onLogin(username);
    } else {
      alert("Ievadi username un password");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pieteikšanās</h2>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button style={{ marginTop: "10px" }} onClick={handleLogin}>
        Pieteikties
      </button>
    </div>
  );
}

export default LoginPage;