import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type } from 'lucide-react';
import GameContainer from '../GameContainer';

const WORDS_BY_LEVEL = {
  1: ['SOL', 'PAN', 'MAR', 'LUZ', 'PEZ', 'REY', 'SUR', 'TOS', 'VOZ', 'SAL'],
  2: ['CASA', 'LUNA', 'GATO', 'PATO', 'ROSA', 'MESA', 'RANA', 'PUMA', 'LAGO', 'FLOR'],
  3: ['PERRO', 'ARBOL', 'LIBRO', 'RELOJ', 'NUBES', 'PLAYA', 'TIGRE', 'FRUTA', 'CARAM', 'PULPO'],
  4: ['PLANETA', 'ESTRELLA', 'GUITARRA', 'ELEFANTE', 'MANZANA', 'BOSQUES', 'COLEGIO', 'PINTURA'],
  5: ['MURCIELAGO', 'ASTRONAUTA', 'MARIPOSAS', 'CHOCOLATE', 'DINOSAURIO', 'EXTRAÑO', 'VEHICULO']
};

const AnagramGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [currentWord, setCurrentWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]); // Array of indices of scrambledLetters
  const [wordsAnswered, setWordsAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

  const generateWord = () => {
    const list = WORDS_BY_LEVEL[Math.min(level, 5)];
    const word = list[Math.floor(Math.random() * list.length)];
    
    // Scramble completely
    let letters = word.split('');
    let scrambled = [...letters].sort(() => Math.random() - 0.5);
    // Ensure it's actually scrambled
    while (scrambled.join('') === word && word.length > 2) {
       scrambled = [...letters].sort(() => Math.random() - 0.5);
    }

    setCurrentWord(word);
    setScrambledLetters(scrambled.map((char, index) => ({ id: index, char })));
    setSelectedLetters([]);
    setFeedback(null);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateWord();
      if (wordsAnswered === 0) setTimeLeft(60);
    }
  }, [gameState, level]);

  // Level Progression
  useEffect(() => {
     if (wordsAnswered >= 5) {
        setLevel(prev => prev + 1);
        setWordsAnswered(0);
        setTimeLeft(prev => prev + 20); // Time bonus
        setScore(prev => prev + 150); // Level up bonus
     }
  }, [wordsAnswered]);

  // Global Timer logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  const handleLetterClick = (letterObj) => {
    if (feedback || selectedLetters.some(l => l.id === letterObj.id)) return;

    const newSelection = [...selectedLetters, letterObj];
    setSelectedLetters(newSelection);

    // Check if word is complete
    if (newSelection.length === currentWord.length) {
       const formedWord = newSelection.map(l => l.char).join('');
       if (formedWord === currentWord) {
           setFeedback('correct');
           setTimeout(() => {
               setScore(prev => prev + (currentWord.length * 10));
               setTimeLeft(prev => prev + 3);
               setWordsAnswered(prev => prev + 1);
               generateWord();
           }, 800);
       } else {
           setFeedback('wrong');
           setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty
           setTimeout(() => {
               setSelectedLetters([]);
               setFeedback(null);
           }, 800);
       }
    }
  };

  const handleRemoveSelection = (indexToRemove) => {
    if (feedback) return;
    // We can only remove the last added letter, or allow removing any.
    // Let's just pop the last one for simplicity or build a robust system.
    const newSelection = [...selectedLetters];
    newSelection.splice(indexToRemove, 1);
    setSelectedLetters(newSelection);
  };

  return (
    <GameContainer
      title="Cazador de Letras"
      description="Ordena las letras para descubrir la palabra oculta antes de que se agote el tiempo."
      instructions={[
        "Verás una serie de letras desordenadas en pantalla.",
        "Haz clic en las letras en el orden correcto para formar la palabra secreta.",
        "Si te equivocas al armar la palabra, perderás tiempo.",
        "Cada palabra correcta te da más tiempo y pasas al siguiente nivel después de 5 palabras."
      ]}
      icon={<Type size={40} color="#8b5cf6" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setWordsAnswered(0); setGameState('playing'); }}
    >
        <div style={{
           display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '700px'
        }}>
            
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '-1rem' }}>
                Progreso: {wordsAnswered}/5
            </div>

            {/* Formed Word Area */}
            <div style={{
               background: 'rgba(255,255,255,0.1)',
               border: feedback === 'correct' ? '2px solid #10b981' : feedback === 'wrong' ? '2px solid #ef4444' : '2px dashed rgba(255,255,255,0.5)',
               borderRadius: '24px',
               padding: '2rem',
               minHeight: '120px',
               width: '100%',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               gap: '0.75rem',
               boxShadow: feedback === 'correct' ? '0 0 30px rgba(16,185,129,0.3)' : feedback === 'wrong' ? '0 0 30px rgba(239,68,68,0.3)' : 'none',
               transition: 'all 0.3s'
            }}>
                <AnimatePresence mode="popLayout">
                   {selectedLetters.map((l, idx) => (
                      <motion.button
                         layout
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 0.5 }}
                         onClick={() => handleRemoveSelection(idx)}
                         key={`sel-${l.id}`}
                         style={{
                             width: '60px', height: '60px',
                             background: 'white', border: 'none', borderRadius: '12px',
                             fontSize: '2rem', fontWeight: 900, color: '#0f172a',
                             cursor: 'pointer',
                             boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                         }}
                      >
                         {l.char}
                      </motion.button>
                   ))}
                </AnimatePresence>
            </div>

            {/* Scrambled Bank */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',
                background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '100%'
            }}>
                {scrambledLetters.map(l => {
                    const isSelected = selectedLetters.some(sel => sel.id === l.id);
                    return (
                        <motion.button
                           key={l.id}
                           whileHover={isSelected ? {} : { scale: 1.1, y: -5 }}
                           whileTap={isSelected ? {} : { scale: 0.9 }}
                           onClick={() => handleLetterClick(l)}
                           style={{
                               width: '70px', height: '70px',
                               background: isSelected ? 'transparent' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                               border: isSelected ? '2px dashed #475569' : 'none',
                               borderRadius: '16px',
                               fontSize: '2.5rem', fontWeight: 900, 
                               color: isSelected ? 'transparent' : 'white',
                               cursor: isSelected ? 'default' : 'pointer',
                               boxShadow: isSelected ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.3)',
                               display: 'flex', alignItems: 'center', justifyContent: 'center'
                           }}
                        >
                            {isSelected ? '' : l.char}
                        </motion.button>
                    );
                })}
            </div>
            
            {/* Feedback Message */}
            {feedback && (
                <motion.div
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   style={{
                       fontSize: '2rem', fontWeight: 900,
                       color: feedback === 'correct' ? '#10b981' : '#ef4444',
                       background: feedback === 'correct' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                       padding: '0.5rem 2rem', borderRadius: '100px'
                   }}
                >
                    {feedback === 'correct' ? '¡Excelente!' : '¡Oops! Intenta de nuevo'}
                </motion.div>
            )}

        </div>
    </GameContainer>
  );
};

export default AnagramGame;
