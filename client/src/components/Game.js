import React, { useState, useEffect } from 'react';
import Board from './Board';
import { Window, MessageList, MessageInput } from 'stream-chat-react';
import '../styles/Chat.css';
import RandomPhrase from './RandomPhrase';
import phantomImage from '../images/phantom.png';
import raoulImage from '../images/raoul.png';
import christineImage from '../images/christine.png';

function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(channel?.state?.watcher_count >= 2);
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleUserWatchingStart = (event) => {
    setPlayersJoined(event.watcher_count >= 2);
  };

  useEffect(() => {
    if (channel) {
      channel.on("user.watching.start", handleUserWatchingStart);
      return () => {
        channel.off("user.watching.start", handleUserWatchingStart);
      };
    }
  }, [channel]);

  useEffect(() => {
    if (playersJoined) {
      console.log("Players joined, channel:", channel);
      const players = Array.from(channel.state.members);
      console.log("Players:", players);
    }
  }, [playersJoined, channel, result]);

  if (!playersJoined) {
    return <div>Waiting for other player to join...</div>;
  }

  return (
    <div className="gameContainer"> 
      <div className={`ChatSidebar ${isChatOpen ? 'show' : ''}`}>
        <Window>
          {isChatOpen && <MessageList disableDateSeparator hideDeletedMessages closeReactionSelectorOnClick messageActions={["react"]} />}
          {isChatOpen && <MessageInput />}
        </Window>
      </div>

      <div className={`ButtonsContainer ${isChatOpen ? 'show' : ''}`}>
        <button onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? 'Hide Chat' : 'Show Chat'}
        </button>
        <button onClick={async () => {
          await channel.stopWatching();
          setChannel(null);
        }}>Leave Game</button>
      </div>
      <div className='randomPhrase'>
        <RandomPhrase />
      </div>

      <div className='Space'></div>
      <div className="bingo-card">
        <Board result={result} setResult={setResult} />
      </div>

      <div className="pixel-art">
        <img src={phantomImage} alt="Phantom" className="Phantom" />
        <img src={christineImage} alt="Christine" className="Christine" />
        <img src={raoulImage} alt="Raoul" className="Raoul" />
      </div>
    </div>
  );
}

export default Game;
