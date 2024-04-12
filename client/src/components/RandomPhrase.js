import React, { useState } from 'react';

const RandomPhrase = () => {
  // Define an array of random phrases
  const phrases = [
     "The Phantom's Mask",
        "Christine's Voice Lesson",
        "The Chandeliers Falls",
        "Masquerade Ball",
        "The Phantom's Lair",
        "All I Ask of you",
        "The Music of the Night",
        "Opera Populaire",
        "Raoul's Proposal",
        "The Phantom's Rose",
        "The Mirror Scene",
        "The Phantom's Disguise",
        "The Angel of Music",
        "Point of No Return",
        "Wandering Child",
        "Think of Me",
        "Angel of Death",
        "Pitiful Creature of Darkness",
        "Beneath the Opera House",
        "Dance of the Seven Veils",
        "Learn to be Lonely",
        "Twisted Every Way",
        "Wishing You Were Somehow Here Again",
        "We Have All Been Blind",
        "Past the Point of No Return"
  ];

  // State to store the currently displayed phrase
  const [currentPhrase, setCurrentPhrase] = useState("");

  // Function to pick a random phrase from the array
  const pickRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setCurrentPhrase(phrases[randomIndex]);
  };

  return (
    <div>
      <h2>Random Phrase</h2>
      <button onClick={pickRandomPhrase}>Generate Phrase</button>
      {currentPhrase && <p>{currentPhrase}</p>}
    </div>
  );
};

export default RandomPhrase;
