import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpellCheck } from 'lucide-react';
import GameContainer from '../GameContainer';

const DICTIONARY = [
  'UBUNTU', 'EDUCACION', 'FUTURO', 'VOLUNTARIO', 'PROGRESO', 
  'LIDERAZGO', 'INNOVACION', 'JUVENTUD', 'CIENCIA', 'HISTORIA',
  'UNIVERSIDAD', 'VALORES', 'TECNOLOGIA', 'EMPATIA', 'PERSEVERANCIA'
];

const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const HangmanGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds to guess

  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 6;

  // Initialize Word
  useEffect(() => {
    if (gameState === 'playing' && !word) {
        setWord(DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]);
        setGuessedLetters(new Set());
        setMistakes(0);
    }
  }, [gameState, word]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  // Check Win/Loss Condition
  useEffect(() => {
      if (gameState === 'playing' && word) {
          const isWinner = word.split('').every(char => guessedLetters.has(char));
          if (isWinner) {
              setScore(prev => prev + 500 + timeLeft); // Bonus points based on time
              setLevel(prev => prev + 1);
              setWord(''); // Trigger next level
              setTimeLeft(prev => prev + 30); // Add time
          } else if (mistakes >= maxMistakes) {
              setGameState('gameover');
          }
      }
  }, [guessedLetters, mistakes, word, gameState, timeLeft]);

  const handleGuess = (char) => {
      if (guessedLetters.has(char) || gameState !== 'playing') return;

      const newGuessed = new Set(guessedLetters);
      newGuessed.add(char);
      setGuessedLetters(newGuessed);

      if (!word.includes(char)) {
          setMistakes(prev => prev + 1);
          setTimeLeft(prev => Math.max(0, prev - 5)); // Penalize time
      }
  };

  const getHangmanVisual = () => {
      // Visual indicators based on mistakes
      const stages = [
          '💯 100% Perfecto',
          '😊 Tienes intentos',
          '🤨 Cuidado...',
          '😰 Sudando la gota fría',
          '😱 ¡Peligro Inminente!',
          '💀 A un error de perder...',
          '👻 Terminado'
      ];
      return stages[Math.min(mistakes, 6)];
  };

  return (
    <GameContainer
      title="Adivina la Palabra"
      description="El clásico juego de ahorcado educativo. Descubre la palabra oculta antes de que se agoten tus intentos."
      instructions={[
        "Tendrás una palabra relacionada a Ubuntu o Educación oculta.",
        "Selecciona letras del teclado en pantalla para adivinarla.",
        "Tómate tu tiempo, pero cuidado con cometer errores.",
        "Fallo = -5 segundos. Si cometes 6 errores, pierdes.",
        "Adivina toda la palabra para ganar puntos y avanzar de nivel."
      ]}
      icon={<SpellCheck size={40} color="#f43f5e" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setWord(''); setGameState('playing'); setTimeLeft(90); }}
    >
        <div style={{
           width: '100%', height: '100%', minHeight: '500px',
           background: 'white', borderRadius: '30px', 
           boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05)',
           display: 'flex', flexDirection: 'column',
           padding: '2rem', alignItems: 'center', justifyContent: 'space-between'
        }}>
           
           {/* Visual state */}
           <div style={{ 
               padding: '1rem 2rem', background: mistakes > 4 ? '#fee2e2' : '#f1f5f9',
               color: mistakes > 4 ? '#ef4444' : '#475569', borderRadius: '100px',
               fontWeight: 800, fontSize: '1.2rem', transition: 'all 0.3s'
           }}>
               Vidas restantes: {maxMistakes - mistakes} | {getHangmanVisual()}
           </div>

           {/* Word Display */}
           <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '3rem 0' }}>
               {word && word.split('').map((char, index) => {
                   const isRevealed = guessedLetters.has(char);
                   return (
                       <motion.div
                           key={index}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           style={{
                               width: '60px', height: '70px',
                               borderBottom: '4px solid #cbd5e1',
                               display: 'flex', alignItems: 'center', justifyContent: 'center',
                               fontSize: '2.5rem', fontWeight: 900, color: '#0f172a'
                           }}
                       >
                           {isRevealed && (
                               <motion.span initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                   {char}
                               </motion.span>
                           )}
                       </motion.div>
                   );
               })}
           </div>

           {/* Keyboard */}
           <div style={{ 
               display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', 
               gap: '0.5rem', maxWidth: '600px', width: '100%' 
           }}>
               {ALPHABET.map(char => {
                   const isGuessed = guessedLetters.has(char);
                   const isCorrect = isGuessed && word.includes(char);
                   const isWrong = isGuessed && !word.includes(char);

                   let bgColor = '#f8fafc';
                   let textColor = '#334155';
                   let borderColor = '#e2e8f0';

                   if (isCorrect) {
                       bgColor = '#10b981'; textColor = 'white'; borderColor = '#059669';
                   } else if (isWrong) {
                       bgColor = '#ef4444'; textColor = 'white'; borderColor = '#b91c1c';
                   }

                   return (
                       <motion.button
                           key={char}
                           whileHover={!isGuessed ? { scale: 1.1 } : {}}
                           whileTap={!isGuessed ? { scale: 0.9 } : {}}
                           onClick={() => handleGuess(char)}
                           disabled={isGuessed}
                           style={{
                               padding: '1rem 0',
                               background: bgColor,
                               color: textColor,
                               border: `2px solid ${borderColor}`,
                               borderRadius: '12px',
                               fontSize: '1.2rem',
                               fontWeight: 800,
                               cursor: isGuessed ? 'not-allowed' : 'pointer',
                               opacity: isGuessed ? 0.7 : 1
                           }}
                       >
                           {char}
                       </motion.button>
                   );
               })}
           </div>

        </div>
    </GameContainer>
  );
};

export default HangmanGame;
