import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const cookies = new Cookies();
  
  // Base URL for your server hosted locally
  const localServerUrl = "http://localhost:3001"; 
  // Base URL for your server hosted on Render
  const renderServerUrl = "https://operaghost.onrender.com"; 

  const login = () => {
    // Constructing the login endpoint URLs
    const localLoginUrl = `${localServerUrl}/login`; 
    const renderLoginUrl = `${renderServerUrl}/login`; 
    
    // Making Axios requests to the constructed endpoint URLs
    Promise.all([
      Axios.post(localLoginUrl, { username, password }),
      Axios.post(renderLoginUrl, { username, password })
    ])
      .then(([localRes, renderRes]) => {
        const res = localRes || renderRes;
        const { token, username, userId } = res.data;
        cookies.set("token", token);
        cookies.set("username", username);
        cookies.set("userId", userId);
        setIsAuth(true);
      })
      .catch((error) => {
        setError("Invalid username or password."); // Update error state
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
