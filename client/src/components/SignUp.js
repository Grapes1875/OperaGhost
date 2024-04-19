import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const vercelServerUrl = "https://operaghost-backend.vercel.app"; 
 

  const signUp = () => {
    setLoading(true);
    const vercelSignUpUrl = `${vercelServerUrl}/signup`; 
    
    Axios.post(vercelSignUpUrl, user)
      .then((response) => {
        const { token, username, userId } = response.data;
        cookies.set("token", token);
        cookies.set("username", username);
        cookies.set("userId", userId);
        setIsAuth(true);
      })
      .catch((error) => {
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
