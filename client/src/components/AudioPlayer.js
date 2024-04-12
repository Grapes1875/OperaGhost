import React, { useState, useRef } from 'react';

const AudioPlayer = ({ songs }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSongChange = (e) => {
    const selectedSong = e.target.value;
    audioRef.current.src = selectedSong;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div>
      <audio ref={audioRef}>
        {songs.map((song, index) => (
          <source key={index} src={song} />
        ))}
      </audio>
      <select onChange={handleSongChange}>
        {songs.map((song, index) => (
          <option key={index} value={song}>{`Song ${index + 1}`}</option>
        ))}
      </select>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default AudioPlayer;
