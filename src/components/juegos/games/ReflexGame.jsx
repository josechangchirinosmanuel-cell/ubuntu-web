import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import GameContainer from '../GameContainer';

const ReflexGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [target, setTarget] = useState(null); // { id, x, y, size }
  const [clicks, setClicks] = useState(0);
  
  const timeoutRef = useRef(null);

  const spawnTarget = () => {
    // Determine size and duration based on level
    const size = Math.max(120 - (level * 10), 40); // Gets smaller
    const duration = Math.max(1500 - (level * 150), 400); // Gets faster
    
    // Position safely within bounds
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 80 + 10; // 10% to 90%

    const newTarget = {
        id: Date.now(),
        x, y, size,
        duration
    };

    setTarget(newTarget);

    // Auto-vanish if missed
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
        setTarget(null);
        // Missed penalty
        setTimeLeft(prev => Math.max(0, prev - 2));
        // Spawn next after a tiny delay
        setTimeout(spawnTarget, Math.random() * 500 + 200);
    }, duration);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      if (clicks === 0) setTimeLeft(60);
      spawnTarget();
    }
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, level]);

  // Level Progression
  useEffect(() => {
     if (clicks >= 10) {
        setLevel(prev => prev + 1);
        setClicks(0);
        setTimeLeft(prev => prev + 15);
        setScore(prev => prev + 200); // Bonus
     }
  }, [clicks]);

  // Global Timer logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTarget(null);
    }
  }, [timeLeft, gameState]);

  const handleTargetClick = (e) => {
      e.stopPropagation(); // Prevent background click penalty if added later
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      setTarget(null); // Remove Target
      setScore(prev => prev + (level * 20)); // Score
      setTimeLeft(prev => prev + 1); // Small time boost
      setClicks(prev => prev + 1);

      // Spawn next rapidly
      setTimeout(spawnTarget, Math.random() * 400 + 100);
  };

  return (
    <GameContainer
      title="Reflejos Ninja"
      description="Prueba tu velocidad de reacción. Atrapa a los objetivos antes de que desaparezcan."
      instructions={[
        "Aparecerán esferas de energía en posiciones aleatorias.",
        "Haz clic o toca la esfera tan rápido como puedas.",
        "Si tardas demasiado, la esfera desaparecerá y perderás 2 segundos.",
        "Por cada 10 esferas que logres tocar, avanzarás de nivel.",
        "En niveles superiores, las esferas serán más diminutas y desaparecerán en fracciones de segundo."
      ]}
      icon={<Zap size={40} color="#eab308" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setClicks(0); setGameState('playing'); }}
    >
        <div style={{
           position: 'relative', width: '100%', height: '100%', minHeight: '500px',
           background: '#0f172a', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.1)',
           overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
        }}>
            {/* Background Grid for aesthetics */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px', pointerEvents: 'none'
            }} />

            <div style={{
                position: 'absolute', top: '20px', right: '20px', color: 'rgba(255,255,255,0.5)', fontWeight: 800
            }}>
                Esferas: {clicks}/10
            </div>

            <AnimatePresence>
               {target && (
                   <motion.button
                       key={target.id}
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ 
                           scale: [0, 1.2, 1], 
                           opacity: 1 
                       }}
                       exit={{ scale: 0, opacity: 0 }}
                       transition={{ duration: 0.2 }}
                       onClick={handleTargetClick}
                       style={{
                           position: 'absolute',
                           top: `${target.y}%`,
                           left: `${target.x}%`,
                           transform: 'translate(-50%, -50%)',
                           width: `${target.size}px`,
                           height: `${target.size}px`,
                           borderRadius: '50%',
                           background: 'radial-gradient(circle at 30% 30%, #fef08a, #eab308)',
                           border: 'none',
                           cursor: 'crosshair',
                           boxShadow: '0 0 20px #eab308, 0 0 40px #eab308',
                           display: 'flex', alignItems: 'center', justifyContent: 'center'
                       }}
                   >
                       <Zap size={target.size * 0.4} color="#854d0e" />
                   </motion.button>
               )}
            </AnimatePresence>
        </div>
    </GameContainer>
  );
};

export default ReflexGame;
