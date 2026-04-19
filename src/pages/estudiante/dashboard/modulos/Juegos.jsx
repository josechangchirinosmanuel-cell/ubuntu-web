import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Brain, Calculator, Music, Type, Zap, Target, SpellCheck, Network } from 'lucide-react';
import MemoryGame from '../../../../components/juegos/games/MemoryGame';
import MathGame from '../../../../components/juegos/games/MathGame';
import SimonGame from '../../../../components/juegos/games/SimonGame';
import AnagramGame from '../../../../components/juegos/games/AnagramGame';
import ReflexGame from '../../../../components/juegos/games/ReflexGame';
import TypingGame from '../../../../components/juegos/games/TypingGame';
import HangmanGame from '../../../../components/juegos/games/HangmanGame';
import SequenceGame from '../../../../components/juegos/games/SequenceGame';

const gamesList = [
  {
    id: 'memory',
    title: 'Memoria Visual',
    description: 'Encuentra los pares de cartas ocultas antes de que se acabe el tiempo.',
    icon: <Brain size={48} />,
    color: '#3b82f6',
    component: MemoryGame
  },
  {
    id: 'math',
    title: 'Operación Relámpago',
    description: 'Resuelve ecuaciones matemáticas a contrarreloj. ¡Demuestra tu agilidad mental!',
    icon: <Calculator size={48} />,
    color: '#f59e0b',
    component: MathGame
  },
  {
    id: 'simon',
    title: 'Simón Dice',
    description: 'Memoriza la secuencia de colores y repítela sin equivocarte. Cada vez más difícil.',
    icon: <Music size={48} />,
    color: '#ec4899',
    component: SimonGame
  },
  {
    id: 'anagram',
    title: 'Cazador de Letras',
    description: 'Letras desordenadas. Tu misión es armar la palabra secreta rápidamente.',
    icon: <Type size={48} />,
    color: '#8b5cf6',
    component: AnagramGame
  },
  {
    id: 'reflex',
    title: 'Reflejos Ninja',
    description: 'Atrapa los objetivos en pantalla antes de que desaparezcan. Pura velocidad.',
    icon: <Zap size={48} />,
    color: '#eab308',
    component: ReflexGame
  },
  {
    id: 'typing',
    title: 'Gravedad de Palabras',
    description: 'Las palabras caen del cielo. Usa tu teclado rápido para destruirlas.',
    icon: <Target size={48} />,
    color: '#10b981',
    component: TypingGame
  },
  {
    id: 'hangman',
    title: 'Adivina la Palabra',
    description: 'El clásico juego del Ahorcado. Ingresa las letras y salva el nivel antes del perder.',
    icon: <SpellCheck size={48} />,
    color: '#f43f5e', // rose
    component: HangmanGame
  },
  {
    id: 'sequence',
    title: 'Secuencia Lógica',
    description: 'Encuentra el patrón matemático y adivina el siguiente número en la serie infinita.',
    icon: <Network size={48} />,
    color: '#0284c7', // sky
    component: SequenceGame
  }
];

const Juegos = () => {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const ActiveComponent = activeGame.component;
    return <ActiveComponent onClose={() => setActiveGame(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
         <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Gamepad2 size={40} color="#3b82f6" fill="#3b82f6" opacity={0.2} />
            Arcade Educativo
            <Gamepad2 size={40} color="#3b82f6" fill="#3b82f6" opacity={0.2} />
         </h1>
         <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto' }}>
            Selecciona un minijuego para entrenar tu cerebro, mejorar tus habilidades y divertirte aprendiendo.
         </p>
      </div>

      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
      }}>
        {gamesList.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveGame(game)}
            className="glass-card"
            style={{
              border: `2px solid ${game.color}30`,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              background: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
               e.currentTarget.style.transform = 'translateY(-8px)';
               e.currentTarget.style.boxShadow = `0 20px 25px -5px ${game.color}30`;
            }}
            onMouseOut={(e) => {
               e.currentTarget.style.transform = 'translateY(0)';
               e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
               position: 'absolute', top: '-20px', right: '-20px',
               color: game.color, opacity: 0.05, transform: 'scale(3)'
            }}>
               {game.icon}
            </div>

            <div style={{
               width: '80px', height: '80px', borderRadius: '24px',
               background: `linear-gradient(135deg, ${game.color}20, ${game.color}40)`,
               color: game.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
               marginBottom: '1.5rem',
               boxShadow: `0 10px 15px -3px ${game.color}20`
            }}>
               {game.icon}
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem' }}>
               {game.title}
            </h3>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontWeight: 500, flex: 1 }}>
               {game.description}
            </p>

            <div style={{
                marginTop: '2rem', padding: '0.75rem 1.5rem',
                background: `${game.color}15`, color: game.color,
                borderRadius: '100px', fontWeight: 800, textAlign: 'center',
                transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = `${game.color}25`}
            onMouseOut={(e) => e.currentTarget.style.background = `${game.color}15`}
            >
                Jugar Ahora
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Juegos;
