import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Base URL for your server hosted locally
  const localServerUrl = "http://localhost:3001"; 
  // Base URL for your server hosted on Render
  const renderServerUrl = "https://operaghost.onrender.com"; 

  const signUp = () => {
    setLoading(true);
    // Constructing the signup endpoint URLs
    const localSignUpUrl = `${localServerUrl}/signup`; 
    const renderSignUpUrl = `${renderServerUrl}/signup`; 
    
    // Making Axios requests to the constructed endpoint URLs
    Promise.all([
      Axios.post(localSignUpUrl, user),
      Axios.post(renderSignUpUrl, user)
    ])
      .then(([localRes, renderRes]) => {
        const res = localRes || renderRes;
        const { token, username, userId } = res.data;
        cookies.set("token", token);
        cookies.set("username", username);
        cookies.set("userId", userId);
        setIsAuth(true);
      })
      .catch(error => {
        setError("Signup failed. Please try again later.");
        console.error("Signup error:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="signUp">
      <label>Sign Up</label>
      <input 
        placeholder="Username" 
        onChange={(event) => setUser({ ...user, username: event.target.value })} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        onChange={(event) => setUser({ ...user, password: event.target.value })} 
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={signUp} disabled={loading}>Sign Up</button>
    </div>
  );
}

export default SignUp;
