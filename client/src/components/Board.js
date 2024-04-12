import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";

function BingoCard({ setResult }) {
  const [phrases, setPhrases] = useState([]);
  const [card, setCard] = useState([]);
  const [markedSquares, setMarkedSquares] = useState(0);

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    // Function to generate 25 random phrases
    const generateRandomPhrases = () => {
      const availablePhrases = [
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

      // Shuffle the phrases array
      const shuffledPhrases = availablePhrases.sort(() => Math.random() - 0.5);
      // Select the first 25 phrases
      return shuffledPhrases.slice(0, 25);
    };

    // Generate random phrases when the component mounts
    const randomPhrases = generateRandomPhrases();
    setPhrases(randomPhrases);

    // Initialize the Bingo card with empty squares
    const initialCard = Array.from({ length: 25 }, () => false);
    setCard(initialCard);
  }, []);

  useEffect(() => {
    checkWin();
  }, [markedSquares]);

  const toggleSquare = (index) => {
    const newCard = [...card];
    newCard[index] = !newCard[index];
    setCard(newCard);
    setMarkedSquares(newCard.filter((square) => square).length);
  };

  const checkWin = () => {
    // Check if all squares are marked
    if (markedSquares === 25) {
      setResult({ winner: "Bingo ", player: client.userID, state: " Won!" });
    }
  };

  useEffect(() => {
    const handleBingoEvent = (event) => {
      if (
        event.type === "bingo-mark-square" &&
        event.user.id !== client.userID
      ) {
        const { index } = event.data;
        const newCard = [...card];
        newCard[index] = true;
        setCard(newCard);
        setMarkedSquares(newCard.filter((square) => square).length);
      }
    };

    channel.on(handleBingoEvent);

    return () => {
      channel.off(handleBingoEvent);
    };
  }, [channel, card, client.userID]);

  return (
    <div className="bingo-card">
      {phrases.map((phrase, index) => (
        <Square
          key={index}
          val={phrase}
          chooseSquare={() => toggleSquare(index)}
          marked={card[index]}
        />
      ))}
      {markedSquares === 25 && <div className="bingo-text">BINGO!</div>}
    </div>
  );
}

export default BingoCard;
