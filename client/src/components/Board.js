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
    const generateRandomPhrases = () => {
      const availablePhrases =[
    "Silent, silent",
    "Bravissima",
    "Scrap metal",
    "Famous violinist",
    "Soar",
    "Idk his name monsieur",
    "Amateurs",
    "No doubt of it",
    "Magical lasso",
    "Hold your tongue",
    "Level of your eyes",
    "Prying pandora!",
    "Lying Delilah",
    "Curse you!",
    "Mystified",
    "Foul play",
    "Free publicity",
    "The divas a disaster",
    "Where is he?! Or she!",
    "Miss das has returned",
    "She needed rest",
    "You are our star",
    "You have replaced me",
    "First Lady of the stage",
    "Prima Donna",
    "She gets her limelight",
    "Lunatic demands",
    "Demands are rejected",
    "Once more!!!!!!!!!",
    "The silent role",
    "Poor fool he makes me laugh",
    "Shame shame shame",
    "The old fool is leaving",
    "Did I not instruct",
    "A toad madame?",
    "Mother!",
    "Why have you brought me here",
    "His eyes will find us there",
    "And In this labyrinth",
    "Those eyes that burn",
    "1000 men",
    "Kill and kill again",
    "Raoul I’ve been there",
    "So distorted, deformed",
    "Darkness, darkness",
    "Christine, Christine",
    "Forget these wide-eyed fears",
    "Warm and calm you",
    "Say you’ll love me",
    "All I ask of you",
    "Share each day with me",
    "You will curse the day",
    "Order your fine horses",
    "I gave you my music",
    "He was bound to love you",
    "Why so silent?",
    "Masquerade",
    "What a night",
    "No more notes",
    "Let’s not argue",
    "You’ll understand in time",
    "Finished score",
    "Don Juan triumphant",
    "No doubt she’ll do her best",
    "Your chains are still mine",
    "You belong to me!",
    "He’s a genius",
    "Genius has turned to madness",
    "Her father promised her",
    "Wishing you were somehow here again",
    "Angel or father",
    "Friend or phantom",
    "Far from my fathering gaze",
    "War upon you both",
    "We have all been blind",
    "We hold the ace",
    "His reign will end",
    "Nothing but a man",
    "Seal my fate tonight",
    "Cut the fun short",
    "Passarino",
    "Trap is set",
    "Succumbed to me",
    "No second thoughts",
    "Decided, decided",
    "Past the point of no return",
    "Silence, silence",
    "No going back now",
    "One final question",
    "Consume us",
    "Piangi, my love",
    "Down once more",
    "Black despair",
    "Deep as hell!",
    "Abhorrent face!",
    "No compassion anywhere",
    "Lust for blood",
    "Lust for flesh",
    "Pity comes too late",
    "Turn around!",
    "It’s in your soul",
    "We have a guest",
    "Unparalleled delight",
    "Free her",
    "Have you no pity",
    "Be my guest sir",
    "Forgive me",
    "You deceived me",
    "Make your choice",
    "Go now!",
    "Leave me!",
    "Angel in hell"
  ];

      const shuffledPhrases = availablePhrases.sort(() => Math.random() - 0.5);
      return shuffledPhrases.slice(0, 25);
    };
    const randomPhrases = generateRandomPhrases();
    setPhrases(randomPhrases);

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
