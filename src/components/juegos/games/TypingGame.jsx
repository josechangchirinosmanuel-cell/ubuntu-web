import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import GameContainer from '../GameContainer';

const DICTIONARY = [
  'HOLA', 'GATO', 'MESA', 'ROSA', 'CAJA', 'AGUA', 'LUNA', 'CIELO', 'PIZZA', 'JUEGOS',
  'COMPUTADORA', 'MURCIELAGO', 'ESTRELLA', 'RAPIDEZ', 'PLANETA', 'ASTRONAUTA', 'UBUNTU',
  'TECLADO', 'MONITOR', 'PANTALLA', 'INTERNET', 'VELOCIDAD', 'EDUCACION', 'SISTEMA'
];

const TypingGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [words, setWords] = useState([]); // { id, text, x }
  const [currentInput, setCurrentInput] = useState('');
  const [wordsDestroyed, setWordsDestroyed] = useState(0);

  const spawnIntervalRef = useRef(null);

  // Spawner
  useEffect(() => {
    if (gameState === 'playing') {
       const spawnRate = Math.max(3000 - (level * 300), 800); // Faster spawning every level
       
       spawnIntervalRef.current = setInterval(() => {
          const newWordText = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
          const xPos = Math.random() * 70 + 10; // 10% to 80%

          setWords(prev => [...prev, {
              id: Date.now().toString(),
              text: newWordText,
              x: xPos,
              speed: Math.max(10 - level, 3) // Animation duration in seconds (lower is faster)
          }]);
       }, spawnRate);

       return () => clearInterval(spawnIntervalRef.current);
    }
  }, [gameState, level]);

  // Global Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
      clearInterval(spawnIntervalRef.current);
      setWords([]);
    }
  }, [timeLeft, gameState]);

  // Level Progression
  useEffect(() => {
     if (wordsDestroyed >= 10) {
        setLevel(prev => prev + 1);
        setWordsDestroyed(0);
        setTimeLeft(prev => prev + 20); // Time bonus
        setScore(prev => prev + 300); // Level bonus
        setCurrentInput('');
     }
  }, [wordsDestroyed]);

  // Keyboard Event Listener
  useEffect(() => {
     if (gameState !== 'playing') return;

     const handleKeyDown = (e) => {
         if (e.key === 'Backspace') {
             setCurrentInput(prev => prev.slice(0, -1));
         } else if (e.key === 'Escape' || e.key === ' ') {
             setCurrentInput(''); // Clear on Space or Esc
         } else if (e.key.length === 1 && e.key.match(/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/)) {
             const key = e.key.toUpperCase();
             setCurrentInput(prev => {
                 const newVal = prev + key;
                 
                 // Auto-check if it fully matches any word
                 const matchedWordIndex = words.findIndex(w => w.text === newVal);
                 if (matchedWordIndex !== -1) {
                     // Destroy word!
                     const matchedWord = words[matchedWordIndex];
                     setWords(currentWords => currentWords.filter(w => w.id !== matchedWord.id));
                     setWordsDestroyed(count => count + 1);
                     setScore(pts => pts + (matchedWord.text.length * 10));
                     return ''; // Reset input automatically upon match
                 }
                 
                 // If doesn't match any prefix, you can optionally clear it, 
                 // but let's just let them backspace or let it clear if there are no partial matches.
                 const hasPartialMatch = words.some(w => w.text.startsWith(newVal));
                 if (!hasPartialMatch) {
                     // small penalty? No penalty, just clear it so they don't get stuck
                     // actually, clearing it immediately might feel buggy if they hit wrong key.
                     // It's better to render it red on UI.
                 }

                 return newVal;
             });
         }
     };

     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, words]);

  // The word disappearing (hitting the ground) logic is tricky to handle perfectly with CSS animations alone,
  // We will assume they just fall infinitely or we could rely on framer-motion onAnimationComplete.
  const handleWordEscape = (id) => {
      // Word hit bottom
      setWords(prev => prev.filter(w => w.id !== id));
      setTimeLeft(prev => Math.max(0, prev - 3)); // Lose time if a word escapes
  };

  return (
    <GameContainer
      title="Gravedad de Palabras"
      description="Las palabras caen del cielo. Escríbelas en tu teclado físico para destruirlas."
      instructions={[
        "No uses tu ratón. Este juego requiere un TECLADO.",
        "Mira las palabras que caen en pantalla y escríbelas exactamente igual.",
        "Si te equivocas de letra, usa Retroceso (Backspace) o Espacio para borrar todo.",
        "Si una palabra toca el fondo, perderás 3 segundos.",
        "Destruye 10 palabras para pasar de nivel. ¡La gravedad aumenta!"
      ]}
      icon={<Target size={40} color="#10b981" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setWordsDestroyed(0); setWords([]); setCurrentInput(''); setGameState('playing'); }}
    >
        <div style={{
           position: 'relative', width: '100%', height: '100%', minHeight: '600px',
           background: '#0f172a', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.1)',
           overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
           display: 'flex', flexDirection: 'column'
        }}>
            {/* Input Display Bar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.5)', padding: '1rem',
                borderTop: '2px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
            }}>
                <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.2rem' }}>
                    Destruidas: {wordsDestroyed}/10
                </div>
                
                <div style={{
                    minWidth: '200px', height: '50px', background: 'white', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 900, color: '#0f172a',
                    boxShadow: '0 0 15px rgba(255,255,255,0.2)',
                    letterSpacing: '5px'
                }}>
                    {currentInput || <span style={{ color: '#cbd5e1', letterSpacing: 'normal', fontSize: '1rem' }}>Escribe aquí...</span>}
                </div>
            </div>

            {/* Falling Words Area */}
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <AnimatePresence>
                   {words.map(word => {
                       const isTargeted = currentInput.length > 0 && word.text.startsWith(currentInput);
                       return (
                           <motion.div
                               key={word.id}
                               initial={{ y: -50, opacity: 1 }}
                               animate={{ y: 800 }} // Assuming screen fits 800px drop before off-screen
                               transition={{ duration: word.speed, ease: 'linear' }}
                               onAnimationComplete={() => handleWordEscape(word.id)}
                               exit={{ scale: 2, opacity: 0 }} // Explosion effect when destroyed
                               style={{
                                   position: 'absolute',
                                   left: `${word.x}%`,
                                   padding: '0.5rem 1rem',
                                   background: isTargeted ? '#10b981' : 'rgba(255,255,255,0.1)',
                                   border: isTargeted ? '2px solid #047857' : '2px solid rgba(255,255,255,0.2)',
                                   borderRadius: '8px',
                                   color: isTargeted ? 'white' : '#e2e8f0',
                                   fontWeight: 900,
                                   fontSize: '1.2rem',
                                   boxShadow: isTargeted ? '0 0 20px rgba(16,185,129,0.5)' : 'none',
                                   backdropFilter: 'blur(5px)'
                               }}
                           >
                               {word.text}
                           </motion.div>
                       );
                   })}
                </AnimatePresence>
            </div>
        </div>
    </GameContainer>
  );
};

export default TypingGame;
