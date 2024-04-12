import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie';

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({ username: '', password: '' });

  const signUp = () => {
    Axios.post("http://localhost:3001/signup", user)
      .then(res => {
        const { token, username, userId, hashedPassword } = res.data;
        cookies.set("token", token);
        cookies.set("username", username);
        cookies.set("userId", userId);
        cookies.set("hashedPassword", hashedPassword);
        setIsAuth(true);
      })
      .catch(error => {
        console.error("Signup error:", error);
      });
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
      <button onClick={signUp}>Sign Up</button>
      </div>
  );
}

export default SignUp;
