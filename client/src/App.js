import './App.css';
import './styles/Title.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import JoinGame from './components/JoinGame';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { useState } from 'react';

function App() {
  const api_key = "tnr699vt7egz";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client
      .connectUser({
        id: cookies.get("userId"),
        name: cookies.get("username"),
        hashedPassword: cookies.get("hashedPassword"),
      },
        token
      ).then((user) => {
        setIsAuth(true);;
      });
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button className="Logout" onClick={logOut}>Logout</button>
        </Chat>) : (
        <>f
        <div className="startMenu"> 
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </div>
        </>
      )}
    </div>
  );
}

export default App;
