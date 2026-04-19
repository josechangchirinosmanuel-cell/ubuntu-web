import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import GameContainer from '../GameContainer';

const EMOJIS = ['🚀', '🦊', '🍎', '🧩', '🎸', '⚽', '🚗', '📚', '🌟', '🎨', '🍕', '🐘', '💎', '🔥', '💧', '☀️'];

const MemoryGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial'); // tutorial, playing, gameover
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  
  // Initialize Level
  useEffect(() => {
    if (gameState === 'playing') {
      const pairCount = Math.min(2 + (level * 2), EMOJIS.length); // Lvl 1: 4 pairs, Lvl 2: 6 pairs
      const selectedEmojis = EMOJIS.slice(0, pairCount);
      const deck = [...selectedEmojis, ...selectedEmojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
      
      setCards(deck);
      setFlippedIndices([]);
      setMatches(0);
      setTimeLeft(Math.max(60 - (level * 5), 20)); // Less time each level
    }
  }, [level, gameState]);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(prev => prev + 1);
          setScore(prev => prev + (10 * level) + timeLeft);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Check Win Condition
  useEffect(() => {
    if (cards.length > 0 && matches === cards.length / 2) {
      setTimeout(() => {
        setLevel(prev => prev + 1);
      }, 500);
    }
  }, [matches, cards.length]);

  return (
    <GameContainer
      title="Memoria Visual"
      description="Pon a prueba y entrena tu memoria a corto plazo encontrando los pares ocultos."
      instructions={[
        "Voltea dos cartas a la vez para ver qué elemento esconden.",
        "Si los elementos coinciden, el par se quedará boca arriba y sumarás puntos.",
        "Si no coinciden, se volverán a voltear en instantes.",
        "Encuentra todos los pares antes de que el reloj llegue a cero.",
        "Cada nivel tendrá más cartas y menos tiempo. ¡Piensa rápido!"
      ]}
      icon={<Brain size={40} color="#3b82f6" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setGameState('playing'); }}
    >
        <div style={{
           display: 'grid',
           gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`,
           gap: '1rem',
           background: 'rgba(255,255,255,0.1)',
           padding: '2rem',
           borderRadius: '24px',
           boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
           border: '1px solid rgba(255,255,255,0.2)'
        }}>
           {cards.map((card, index) => (
             <motion.button
               key={card.id}
               onClick={() => handleCardClick(index)}
               animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
               transition={{ duration: 0.3 }}
               style={{
                  width: '90px',
                  height: '110px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  background: 'transparent',
                  border: 'none',
                  cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                  perspective: '1000px'
               }}
             >
                {/* Back (Hidden state) */}
                <div style={{
                   position: 'absolute', width: '100%', height: '100%',
                   backfaceVisibility: 'hidden',
                   background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                   borderRadius: '16px',
                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   fontSize: '2rem', color: 'white', fontWeight: 900,
                   border: '2px solid rgba(255,255,255,0.2)'
                }}>
                   ?
                </div>

                {/* Front (Revealed state) */}
                <div style={{
                   position: 'absolute', width: '100%', height: '100%',
                   backfaceVisibility: 'hidden',
                   background: card.isMatched ? '#10b981' : 'white',
                   borderRadius: '16px',
                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   fontSize: '3rem',
                   transform: 'rotateY(180deg)',
                   border: card.isMatched ? '2px solid #059669' : '2px solid #e2e8f0'
                }}>
                   {card.emoji}
                </div>
             </motion.button>
           ))}
        </div>
    </GameContainer>
  );
};

export default MemoryGame;
