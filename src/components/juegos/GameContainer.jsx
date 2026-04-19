import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock, Star, Play, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

const GameContainer = ({ 
  title, 
  description, 
  instructions, 
  icon,
  onClose,
  children, // The game logic component
  gameState, // 'tutorial', 'playing', 'gameover'
  setGameState,
  score,
  level,
  timeLeft,
  onRestart
}) => {
  return (
    <div style={{
       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
       backgroundColor: 'rgba(15, 23, 42, 0.95)',
       backdropFilter: 'blur(10px)',
       zIndex: 100,
       display: 'flex', flexDirection: 'column'
    }}>
      {/* Top HUD */}
      <div style={{
         padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
         display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
           <div style={{ fontSize: '2rem' }}>{icon}</div>
           <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>{title}</h2>
        </div>
        
        {gameState === 'playing' && (
           <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '1.2rem', fontWeight: 800 }}>
                 <Trophy size={24} /> {score} pts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '1.2rem', fontWeight: 800 }}>
                 <Star size={24} /> Nivel {level}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft <= 10 ? '#ef4444' : '#10b981', fontSize: '1.2rem', fontWeight: 800 }}>
                 <Clock size={24} /> 00:{timeLeft.toString().padStart(2, '0')}
              </div>
           </div>
        )}

        <button onClick={onClose} style={{
           background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
           width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           transition: 'background 0.2s'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
           <X size={24} />
        </button>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
         <AnimatePresence mode="wait">
           {gameState === 'tutorial' && (
              <motion.div
                 key="tutorial"
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                 style={{
                    background: 'white', maxWidth: '600px', width: '100%',
                    padding: '3rem', borderRadius: '24px', textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                 }}
              >
                 <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
                 <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>{title}</h2>
                 <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>{description}</p>
                 
                 <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', marginBottom: '2.5rem' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#334155' }}>¿Cómo jugar?</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569', lineHeight: 1.6 }}>
                       {instructions.map((inst, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{inst}</li>)}
                    </ul>
                 </div>

                 <Button onClick={() => setGameState('playing')} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Play fill="currentColor" /> ¡Comenzar Juego!
                 </Button>
              </motion.div>
           )}

           {gameState === 'playing' && (
              <motion.div
                 key="playing"
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                 style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                  {children}
              </motion.div>
           )}

           {gameState === 'gameover' && (
              <motion.div
                 key="gameover"
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 style={{
                    background: 'white', maxWidth: '500px', width: '100%',
                    padding: '3rem', borderRadius: '24px', textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                 }}
              >
                 <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏱️</div>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#ef4444' }}>¡Fin del Juego!</h2>
                 
                 <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: 700, margin: 0 }}>Puntuación</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24', margin: 0 }}>{score}</p>
                    </div>
                    <div style={{ width: '2px', background: '#e2e8f0' }}></div>
                    <div>
                        <p style={{ color: '#64748b', fontWeight: 700, margin: 0 }}>Nivel</p>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', margin: 0 }}>{level}</p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                     <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>Menú</Button>
                     <Button onClick={onRestart} style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <RotateCcw size={20} /> Jugar de Nuevo
                     </Button>
                 </div>
              </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default GameContainer;
