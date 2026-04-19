import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import Button from './Button';
import api from '../../services/api';

const QuizView = ({ lessonId, type, color, onComplete, initialData }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(type === 'exercise' ? 3 * 60 : 10 * 60);
    const [result, setResult] = useState(null); // { score, passed, correctCount }
    const [submitting, setSubmitting] = useState(false);
    
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/student/lessons/${lessonId}/questions?type=${type}`);
            if (response.data.success) {
                setQuestions(response.data.data.questions);
                // Reset state
                setAnswers({});
                setCurrentIndex(0);
                setTimeLeft(type === 'exercise' ? 3 * 60 : 10 * 60);
                setResult(null);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setResult(initialData);
            setLoading(false);
        } else {
            fetchQuestions();
        }
    }, [lessonId, type]); // Nos aseguramos de inicializar correctamente cuando cambia la lección

    // Timer Logic
    useEffect(() => {
        if (loading || result || submitting) return;

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, loading, result, submitting]);

    const handleSelectOption = (questionId, optionLetter) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await api.post(`/student/lessons/${lessonId}/submit`, {
                type,
                answers
            });
            if (response.data.success) {
                setResult(response.data.data);
                // Call parent callback to update checkmarks
                if (onComplete) onComplete(response.data.data);
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Cargando evaluación...</div>;
    }

    // Results Screen needs to be evaluated BEFORE checking questions.length === 0
    // because if we pass initialData, questions will intentionally be empty
    if (result) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                    textAlign: 'center', padding: '4rem 2rem', 
                    background: result.passed ? '#f0fdf4' : '#fef2f2',
                    borderRadius: '20px', border: `2px solid ${result.passed ? '#4ade80' : '#f87171'}`
                }}
            >
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                >
                    {result.passed ? <Award size={80} color="#10b981" style={{margin:'0 auto 1rem'}}/> : <XCircle size={80} color="#ef4444" style={{margin:'0 auto 1rem'}}/>}
                    
                    <h2 style={{ fontSize: '2.5rem', color: result.passed ? '#166534' : '#991b1b', marginBottom: '0.5rem' }}>
                        Nota Final: {result.score} / 20
                    </h2>
                    
                    <p style={{ fontSize: '1.2rem', color: result.passed ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                        {result.passed ? '¡Excelente trabajo! Has aprobado.' : 'No bajemos los brazos, repasa la teoría e inténtalo de nuevo.'}
                    </p>
                    
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>
                        Acertaste {result.correctCount} de {result.totalCount} preguntas.
                    </p>

                    {type === 'exercise' && (
                        <div style={{ marginTop: '2.5rem' }}>
                            <Button onClick={() => fetchQuestions()} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                                Volver a Intentar
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        );
    }

    if (questions.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h3>No hay preguntas aún para esta evaluación.</h3>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLast = currentIndex === questions.length - 1;
    const hasAnsweredCurrent = !!answers[currentQ.id];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Top Bar: Progress and Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748b' }}>
                    Pregunta {currentIndex + 1} de {questions.length}
                </div>
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    padding: '0.5rem 1rem', borderRadius: '100px',
                    background: timeLeft < 60 ? '#fee2e2' : '#f1f5f9',
                    color: timeLeft < 60 ? '#ef4444' : '#334155',
                    fontWeight: 800, fontSize: '1.2rem'
                }}>
                    <Clock size={20} />
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '3rem', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    style={{ height: '100%', background: color || '#3b82f6' }}
                />
            </div>

            {/* Question Box */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{ flex: 1 }}
                >
                    <h3 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.5 }}>
                        {currentQ.question_text}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['a', 'b', 'c', 'd'].map(letter => {
                            const optionText = currentQ[`option_${letter}`];
                            if (!optionText) return null; // Some might have only 3 options
                            
                            const isSelected = answers[currentQ.id] === letter;

                            return (
                                <button
                                    key={letter}
                                    onClick={() => handleSelectOption(currentQ.id, letter)}
                                    style={{
                                        width: '100%', padding: '1.2rem 1.5rem',
                                        textAlign: 'left', fontSize: '1.1rem',
                                        background: isSelected ? `${color || '#3b82f6'}15` : 'white',
                                        border: `2px solid ${isSelected ? (color || '#3b82f6') : '#e2e8f0'}`,
                                        borderRadius: '12px', cursor: 'pointer',
                                        color: isSelected ? (color || '#3b82f6') : '#334155',
                                        fontWeight: isSelected ? 700 : 500,
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ 
                                        minWidth: '32px', height: '32px', borderRadius: '8px',
                                        background: isSelected ? (color || '#3b82f6') : '#f1f5f9',
                                        color: isSelected ? 'white' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, textTransform: 'uppercase'
                                    }}>
                                        {letter}
                                    </div>
                                    <span style={{ lineHeight: 1.4 }}>{optionText}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
                {isLast ? (
                    <Button 
                        onClick={handleSubmit} 
                        disabled={submitting || !hasAnsweredCurrent}
                        style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: '#10b981' }}
                    >
                        {submitting ? 'Evaluando...' : 'Entregar Evaluación'}
                    </Button>
                ) : (
                    <Button 
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        disabled={!hasAnsweredCurrent}
                        variant="primary"
                    >
                        Siguiente Pregunta
                    </Button>
                )}
            </div>

        </div>
    );
};

export default QuizView;
