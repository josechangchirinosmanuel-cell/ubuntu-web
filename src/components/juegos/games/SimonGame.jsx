import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import GameContainer from '../GameContainer';

const COLORS = [
  { id: 0, hex: '#ef4444', name: 'Rojo' }, // Top Left
  { id: 1, hex: '#3b82f6', name: 'Azul' }, // Top Right
  { id: 2, hex: '#eab308', name: 'Amarillo' }, // Bottom Left
  { id: 3, hex: '#10b981', name: 'Verde' } // Bottom Right
];

const SimonGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isSystemTurn, setIsSystemTurn] = useState(false);
  const [activePad, setActivePad] = useState(null); // Which pad is currently lit up
  
  // Audio contexts could go here, but we will use visual feedback

  // Start sequence on new level
  useEffect(() => {
    if (gameState === 'playing') {
       if (sequence.length === 0) {
           // Initialize first step
           addNewStep([]);
       } else {
           playSequence();
       }
    }
  }, [level, gameState]);

  // Global Timer logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  const addNewStep = (currentSeq) => {
    const nextPad = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextPad];
    setSequence(newSeq);
    setPlayerStep(0);
    // Let state update, then play
    setTimeout(() => {
       playSequence(newSeq);
    }, 500);
  };

  const playSequence = async (seqToPlay = sequence) => {
    setIsSystemTurn(true);
    let speed = Math.max(800 - (level * 50), 250); // Gets faster
    
    // Pause before sequence starts
    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < seqToPlay.length; i++) {
        // Light up
        setActivePad(seqToPlay[i]);
        await new Promise(r => setTimeout(r, speed * 0.6)); // light up duration
        
        // Turn off
        setActivePad(null);
        await new Promise(r => setTimeout(r, speed * 0.4)); // gap duration
    }
    
    setIsSystemTurn(false);
  };

  const handlePadClick = (padId) => {
    if (isSystemTurn || gameState !== 'playing') return;

    // Flash light briefly
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    // Check correct
    if (padId === sequence[playerStep]) {
        // Correct step
        const nextStep = playerStep + 1;
        setPlayerStep(nextStep);
        setScore(prev => prev + 10);

        if (nextStep === sequence.length) {
            // Level completed!
            setIsSystemTurn(true); // lock board
            setTimeout(() => {
                setLevel(prev => prev + 1);
                setTimeLeft(prev => prev + 5); // Time bonus for finishing sequence
                setScore(prev => prev + (50 * level)); // Level bonus
                addNewStep(sequence);
            }, 1000);
        }
    } else {
        // Wrong pad!
        setGameState('gameover');
    }
  };

  return (
    <GameContainer
      title="Simón Dice"
      description="Memoriza la secuencia de colores y repítela perfectamente. Un error y mueres."
      instructions={[
        "Observa atentamente el tablero de 4 colores.",
        "El juego reproducirá una secuencia iluminando los botones.",
        "Cuando termine, repite exactamente LA MISMA secuencia.",
        "Si aciertas toda la secuencia, pasas al siguiente nivel (la secuencia crece).",
        "Tienes tiempo límite general. Si te equivocas de botón 1 sola vez, pierdes."
      ]}
      icon={<Music size={40} color="#ec4899" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setSequence([]); setTimeLeft(60); setGameState('playing'); }}
    >
        <div style={{
           display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'
        }}>
            {/* Status indicator */}
            <div style={{
               background: isSystemTurn ? '#ef4444' : '#10b981',
               color: 'white', fontWeight: 800, padding: '0.75rem 2rem',
               borderRadius: '100px', fontSize: '1.2rem',
               transition: 'background 0.3s',
               boxShadow: isSystemTurn ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
                {isSystemTurn ? 'Memoriza la secuencia...' : '¡Tu Turno!'}
            </div>

            {/* Simon Board */}
            <div style={{
               background: '#1e293b',
               padding: '1.5rem',
               borderRadius: '50%',
               boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
               display: 'grid',
               gridTemplateColumns: '1fr 1fr',
               gap: '1rem',
               width: '350px',
               height: '350px'
            }}>
                {COLORS.map((color, index) => {
                    const isLit = activePad === color.id;
                    return (
                       <motion.button
                          key={color.id}
                          whileTap={isSystemTurn ? {} : { scale: 0.95 }}
                          onClick={() => handlePadClick(color.id)}
                          style={{
                              background: color.hex,
                              border: 'none',
                              opacity: isLit ? 1 : 0.4,
                              cursor: isSystemTurn ? 'default' : 'pointer',
                              borderTopLeftRadius: index === 0 ? '100%' : '10px',
                              borderTopRightRadius: index === 1 ? '100%' : '10px',
                              borderBottomLeftRadius: index === 2 ? '100%' : '10px',
                              borderBottomRightRadius: index === 3 ? '100%' : '10px',
                              boxShadow: isLit ? `0 0 40px ${color.hex}` : 'inset 0 0 20px rgba(0,0,0,0.5)',
                              transition: 'opacity 0.1s, box-shadow 0.1s'
                          }}
                       />
                    )
                })}
            </div>
            
            {/* Sequence tracker */}
            {gameState === 'playing' && !isSystemTurn && (
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {sequence.map((_, i) => (
                     <div key={i} style={{
                         width: i < playerStep ? '16px' : '10px',
                         height: i < playerStep ? '16px' : '10px',
                         background: i < playerStep ? '#10b981' : '#475569',
                         borderRadius: '50%',
                         transition: 'all 0.3s'
                     }} />
                  ))}
               </div>
            )}
        </div>
    </GameContainer>
  );
};

export default SimonGame;
