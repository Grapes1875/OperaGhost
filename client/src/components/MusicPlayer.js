import React, { useState } from 'react';

function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const songs = [
    "/music/All I Ask Of You.mp3",
    "/music/Music of the Night.mp3",
    "/music/Phantom.mp3"
  ];

  const handlePlayPause = () => {
    if (currentSongIndex !== null) {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.error("Error playing audio:", error));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    audioRef.current.load();
  };

  return (
    <div className="music-player">
      <h2>Music Player</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index} onClick={() => handleSongSelect(index)}>
            {song}
          </li>
        ))}
      </ul>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <audio ref={audioRef} src={currentSongIndex !== null ? songs[currentSongIndex] : null} />
    </div>
  );
}

export default MusicPlayer;
