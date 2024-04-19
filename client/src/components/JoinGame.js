import React, { useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";
import phantomTitleImage from '../images/phantomTitle.png';
import phantomAudio from '../music/Phantom.mp3';
import musicNightAudio from '../music/Music of the Night.mp3';
import askofYouAudio from '../music/All I Ask Of You.mp3'

function JoinGame() {
  const [lobbyName, setLobbyName] = useState('');
  const [channel, setChannel] = useState(null);
  const [audio, setAudio] = useState(null);
  const { client } = useChatContext();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (channel) {
      fetchMembers();
    }
  }, [channel]);

  const fetchMembers = async () => {
    try {
      if (channel) {
        console.log("Fetching members...");
        const response = await channel.queryMembers({});
        console.log("Fetched members:", response.members);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const createChannel = async () => {
    try {
      if (!lobbyName.trim()) {
        alert("Please enter a lobby name.");
        return;
      }

      const hostUserId = client.userID;
      const response = await client.queryUsers({ id: { $ne: hostUserId } });

      if (response.users.length === 0) {
        alert("No other users found.");
        return;
      }

      const otherMember = response.users[0].id;
      const newChannel = await client.channel("messaging", {
        name: lobbyName,
        members: [hostUserId, otherMember],
      });

      await newChannel.watch();
      setChannel(newChannel);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const joinChannel = async () => {
    try {
      if (!lobbyName.trim()) {
        alert("Please enter a lobby name.");
        return;
      }

      const response = await client.queryChannels({
        type: 'messaging',
        name: lobbyName,
      });

      if (response.length === 0) {
        alert("Lobby not found");
        return;
      }

      const existingChannel = response[0];
      await existingChannel.watch();
      setChannel(existingChannel);
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  const playAudio = () => {
    if (!isPlaying) {
      const audioFiles = [phantomAudio, musicNightAudio, askofYouAudio];
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      const selectedAudio = audioFiles[randomIndex];
      const newAudio = new Audio(selectedAudio);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    } else {
      audio.pause(); // Pause the currently playing audio
      setIsPlaying(false);
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel}/>
        </Channel>
      ) : (
        <div className="joinGame">
          <div className="pTitle">
            <img src={phantomTitleImage} alt="Phantom Title" className="photo"/>
            <h1 className="title">Phantom of the Opera</h1>
          </div>
          <h4>Create/Join Game</h4>
          <input
            placeholder="Enter lobby name..."
            value={lobbyName}
            onChange={(event) => {
              setLobbyName(event.target.value);
            }}
          />
          <button onClick={createChannel}>Create Lobby</button>
          <button onClick={joinChannel}>Join Lobby</button>
          <button onClick={playAudio}>{isPlaying ? 'Pause Audio' : 'Play Audio'}</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;
