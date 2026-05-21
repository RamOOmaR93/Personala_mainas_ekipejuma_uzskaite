import { useState } from "react";
import API_URL from "../config";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Ievadi username un password");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
    <div className="login-page">
      <div className="login-card card">
        
        <h2 className="login-title">
          Pašvaldības Policijas Sistēma
        </h2>

        
        

        <div className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />

          <button className="btn login-button" onClick={handleLogin}>
            Pieteikties
          </button>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;