import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const cookies = new Cookies();
  
  const localServerUrl = "http://localhost:3001"; 

  const login = () => {
    const localLoginUrl = `${localServerUrl}/login`; 
    
    Axios.post(localLoginUrl, { username, password })
      .then((response) => {
        const { token, username, userId } = response.data;
        cookies.set("token", token);
        cookies.set("username", username);
        cookies.set("userId", userId);
        setIsAuth(true);
      })
      .catch((error) => {
        setError("Invalid username or password.");
      });
  };

  return (
    <div className="login">
      <label>Login</label>
      <input
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
