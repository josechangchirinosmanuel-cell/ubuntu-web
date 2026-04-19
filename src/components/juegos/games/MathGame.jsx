import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import GameContainer from '../GameContainer';

const MathGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('tutorial');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [currentEquation, setCurrentEquation] = useState({ text: '', answer: 0, options: [] });
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateEquation = useCallback(() => {
    let operator, num1, num2, answer;
    const ops = ['+', '-'];
    if (level > 2) ops.push('*');
    if (level > 4) ops.push('/');

    operator = ops[Math.floor(Math.random() * ops.length)];
    const maxVal = level * 10;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * maxVal) + 1;
      num2 = Math.floor(Math.random() * maxVal) + 1;
      answer = num1 + num2;
    } else if (operator === '-') {
      num1 = Math.floor(Math.random() * maxVal) + 10;
      num2 = Math.floor(Math.random() * num1); // ensure positive result
      answer = num1 - num2;
    } else if (operator === '*') {
      num1 = Math.floor(Math.random() * (level * 3)) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      answer = num1 * num2;
    } else if (operator === '/') {
      num2 = Math.floor(Math.random() * 10) + 2;
      answer = Math.floor(Math.random() * (level * 3)) + 2;
      num1 = num2 * answer; // ensure clean division
    }

    const text = `${num1} ${operator} ${num2} = ?`;
    
    // Generate 3 wrong options close to the answer
    let optionsList = [answer];
    while (optionsList.length < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAnswer = answer + offset;
      if (wrongAnswer !== answer && !optionsList.includes(wrongAnswer) && wrongAnswer >= 0) {
        optionsList.push(wrongAnswer);
      }
    }
    
    optionsList.sort(() => Math.random() - 0.5);

    setCurrentEquation({ text, answer, options: optionsList });
    setFeedback(null);
  }, [level]);

  useEffect(() => {
    if (gameState === 'playing') {
      generateEquation();
      if (questionsAnswered === 0) setTimeLeft(45); // Reset time entirely on first play
    }
  }, [gameState, generateEquation, questionsAnswered]); // questionsAnswered dependency ensures fresh level generation but we need to watch out for infinite loops.
  // Actually, generateEquation is stable.

  // Level progression
  useEffect(() => {
     if (questionsAnswered >= 10) {
        setLevel(prev => prev + 1);
        setQuestionsAnswered(0);
        setTimeLeft(prev => prev + 15); // Bonus time for leveling up
        setScore(prev => prev + 100); // Level up bonus
     }
  }, [questionsAnswered]);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [timeLeft, gameState]);

  const handleOptionSelect = (selectedVal) => {
    if (feedback) return; // Prevent double clicks
    
    if (selectedVal === currentEquation.answer) {
      setFeedback('correct');
      setTimeout(() => {
        setScore(prev => prev + 10 * level);
        setTimeLeft(prev => prev + 2); // Time bonus for correct!
        setQuestionsAnswered(prev => prev + 1);
        generateEquation();
      }, 400);
    } else {
      setFeedback('wrong');
      setTimeLeft(prev => Math.max(0, prev - 3)); // Penalty
      setTimeout(() => {
        generateEquation();
      }, 400);
    }
  };

  return (
    <GameContainer
      title="Operación Relámpago"
      description="Ponte a prueba resolviendo operaciones matemáticas contra el reloj. Pura agilidad neuronal."
      instructions={[
        "Aparecerá una ecuación incompleta en la pantalla.",
        "Selecciona rápidamente la respuesta correcta entre 4 opciones.",
        "Respuestas correctas aumentan tu puntaje, te dan +2 segundos y avanzas hacia el siguiente nivel.",
        "Las respuestas incorrectas te restan 3 segundos de vida. ¡Ten cuidado!",
        "Cada 10 aciertos subes de nivel y la dificultad (y los operadores) aumentan."
      ]}
      icon={<Calculator size={40} color="#f59e0b" />}
      onClose={onClose}
      gameState={gameState}
      setGameState={setGameState}
      score={score}
      level={level}
      timeLeft={timeLeft}
      onRestart={() => { setLevel(1); setScore(0); setQuestionsAnswered(0); setGameState('playing'); }}
    >
      <div style={{
          background: 'white',
          padding: '3rem 4rem',
          borderRadius: '30px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%'
      }}>
          <div style={{
              fontSize: '1.2rem', color: '#64748b', fontWeight: 800, marginBottom: '2rem',
              display: 'flex', justifyContent: 'space-between'
          }}>
             <span>Progreso del nivel: {questionsAnswered}/10</span>
          </div>

          <motion.div
             key={currentEquation.text}
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1, 
                rotate: feedback === 'wrong' ? [0, -5, 5, -5, 5, 0] : 0 
             }}
             transition={{ duration: 0.3 }}
             style={{
                fontSize: '4.5rem', fontWeight: 900, color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : '#0f172a',
                marginBottom: '3rem',
                minHeight: '100px' // Prevent layout shift
             }}
          >
             {currentEquation.text}
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             {currentEquation.options.map((opt, i) => (
                <motion.button
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleOptionSelect(opt)}
                   style={{
                      padding: '1.5rem',
                      fontSize: '2rem',
                      fontWeight: 800,
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      color: '#334155',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      borderBottom: '4px solid #cbd5e1',
                      transition: 'all 0.1s'
                   }}
                >
                   {opt}
                </motion.button>
             ))}
          </div>
      </div>
    </GameContainer>
  );
};

export default MathGame;
