import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from 'lucide-react';
import GameContainer from '../GameContainer';

const generateSequence = (level) => {
    // Generate sequences based on level
    // Level 1-3: Simple additions (e.g. +2, +5)
    // Level 4-6: Multiplications or alternations
    // Level 7+: Fibonacci-like or complex
    
    let seq = [];
    let answer = 0;
    
    if (level <= 3) {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        seq = [start, start + step, start + step * 2, start + step * 3];
        answer = start + step * 4;
    } else if (level <= 6) {
        const start = Math.floor(Math.random() * 5) + 2;
        const mult = Math.floor(Math.random() * 2) + 2;
        seq = [start, start * mult, start * Math.pow(mult, 2), start * Math.pow(mult, 3)];
        answer = start * Math.pow(mult, 4);
    } else {
        // Fibonacci style
        let a = Math.floor(Math.random() * 5) + 1;
        let b = Math.floor(Math.random() * 5) + (a + 1);
        seq = [a, b, a + b, b + (a + b)];
        answer = (a + b) + (b + (a + b));
    }

    // Generate wrong options
    const options = [answer];
    while(options.length < 4) {
        const offset = Math.floor(Math.random() * 20) - 10;
        const wrongAns = answer + offset;
        if (wrongAns !== answer && !options.includes(wrongAns) && wrongAns > 0) {
            options.push(wrongAns);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return { seq, answer, options };
};

const SequenceGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [currentProblem, setCurrentProblem] = useState(null);
  const [statusColor, setStatusColor] = useState('white'); // For flash effects

  useEffect(() => {
    if (gameState === 'playing' && !currentProblem) {
        setCurrentProblem(generateSequence(level));
    }
  }, [gameState, level, currentProblem]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  const handleOptionClick = (selected) => {
      if (!currentProblem || gameState !== 'playing') return;

      if (selected === currentProblem.answer) {
          // Success
          setStatusColor('#10b981'); // flash green
          setTimeout(() => setStatusColor('white'), 300);
          
          setScore(prev => prev + 100 + (level * 20));
          setTimeLeft(prev => prev + 3);
          setLevel(prev => prev + 1);
          setCurrentProblem(null); // Generate next
      } else {
          // Wrong
          setStatusColor('#ef4444'); // flash red
          setTimeout(() => setStatusColor('white'), 300);
          setTimeLeft(prev => Math.max(0, prev - 5)); // Penalize 5 seconds
      }
  };

  return (
    <GameContainer
      title="Secuencia Lógica"
      description="Encuentra el patrón matemático. Observa los números y adivina cuál es el siguiente en la serie."
      instructions={[
        "Se te mostrará una serie de números (Ej: 2, 4, 6, 8...).",
        "Selecciona cuál número crees que continúa la secuencia.",
        "Si aciertas, pasas al siguiente nivel y ganas tiempo extra.",
        "Si fallas, pierdes 5 valiosos segundos.",
        "El juego avanzará desde sumas simples hasta multiplicaciones complejas."
      ]}
      icon={<Network size={40} color="#0284c7" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setCurrentProblem(null); setGameState('playing'); setTimeLeft(60); }}
    >
        <motion.div 
           animate={{ backgroundColor: statusColor }}
           transition={{ duration: 0.3 }}
           style={{
               width: '100%', height: '100%', minHeight: '500px',
               borderRadius: '30px', 
               boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05)',
               display: 'flex', flexDirection: 'column',
               padding: '2rem', alignItems: 'center', justifyContent: 'center'
           }}
        >
            
            {currentProblem && (
                <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    
                    <h3 style={{ color: '#64748b', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
                        ¿Qué número sigue?
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {currentProblem.seq.map((num, i) => (
                            <React.Fragment key={i}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '20px',
                                    background: '#f1f5f9', color: '#0f172a',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', fontWeight: 900, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}>
                                    {num}
                                </div>
                                <span style={{ fontSize: '2rem', color: '#cbd5e1', fontWeight: 900 }}>,</span>
                            </React.Fragment>
                        ))}
                        
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px',
                            background: '#0ea5e9', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(14,165,233,0.3)'
                        }}>
                            ?
                        </div>
                    </div>

                    <div style={{ 
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                        marginTop: '4rem', width: '100%', maxWidth: '500px'
                    }}>
                        {currentProblem.options.map((opt, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOptionClick(opt)}
                                style={{
                                    padding: '1.5rem', background: 'white',
                                    border: '3px solid #e0f2fe', borderRadius: '20px',
                                    fontSize: '2rem', fontWeight: 900, color: '#0369a1',
                                    cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>

                </div>
            )}
        </motion.div>
    </GameContainer>
  );
};

export default SequenceGame;
