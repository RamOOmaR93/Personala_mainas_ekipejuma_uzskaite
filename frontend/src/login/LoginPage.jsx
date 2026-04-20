import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Ievadi username un password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      console.log("LOGIN SUCCESS:", data);

      // 👉 nododam visu user objektu uz App.js
      onLogin(data);

    } catch (error) {
      alert("Nepareizs lietotājvārds vai parole");
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