import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Circle, PlayCircle, ChevronDown, GraduationCap } from 'lucide-react';
import api from '../../../../services/api';
import Button from '../../../../components/common/Button';
import QuizView from '../../../../components/common/QuizView';

const CourseContentView = ({ courseId, onBack }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [tab, setTab] = useState('theory'); // 'theory', 'exercises', 'exam'

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/student/courses/${courseId}/content`);
        if (response.data.success) {
          setContent(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching course content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [courseId]);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando contenido del curso...</div>;
  if (!content) return <div>No se pudo cargar el curso.</div>;

  const currentWeek = content.weeks.find(w => w.number === activeWeek);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ 
        padding: '0.5rem 0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem' 
      }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 900, marginBottom: '0.25rem', color: '#0f172a' }}>{content.course.name}</h2>
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Navegación del curso</p>
        </div>
        <Button onClick={onBack} variant="outline" size="small">Volver</Button>
      </div>

      <div className="course-content-layout">
        {/* Sidebar Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              padding: '1.5rem', 
              background: `linear-gradient(135deg, ${content.course.color || '#3b82f6'}15, transparent)`,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a' }}>
                <BookOpen size={22} color={content.course.color || '#3b82f6'} />
                Syllabus
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                {content.weeks.length} Semanas de aprendizaje
              </p>
            </div>

            <div className="hide-scrollbar" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              {content.weeks.map(w => (
                <div key={w.number} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                        setActiveWeek(activeWeek === w.number ? null : w.number); 
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: activeWeek === w.number ? `1px solid ${content.course.color || '#3b82f6'}30` : '1px solid transparent',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: activeWeek === w.number ? `${content.course.color || '#3b82f6'}10` : '#f8fafc',
                      color: activeWeek === w.number ? (content.course.color || '#0f172a') : '#334155',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: activeWeek === w.number ? `0 4px 12px ${content.course.color || '#3b82f6'}10` : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: activeWeek === w.number ? (content.course.color || '#3b82f6') : '#e2e8f0',
                            color: activeWeek === w.number ? '#fff' : '#64748b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', fontWeight: 800, transition: 'all 0.3s'
                        }}>
                            S{w.number}
                        </div>
                        <span style={{ fontSize: '1rem' }}>Semana {w.number}</span>
                    </div>
                    
                    <motion.div
                       animate={{ rotate: activeWeek === w.number ? 180 : 0 }}
                       transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={18} color={activeWeek === w.number ? (content.course.color || '#3b82f6') : '#94a3b8'} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeWeek === w.number && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ 
                            padding: '0.5rem 0.5rem 0.5rem 1rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.2rem',
                            borderLeft: `2px solid ${content.course.color || '#3b82f6'}30`,
                            marginLeft: '1.5rem',
                            marginTop: '0.2rem'
                        }}>
                          {w.lessons.map(lesson => {
                             const isSelected = selectedLesson?.id === lesson.id;
                             return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              style={{
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '0.9rem',
                                fontWeight: isSelected ? 700 : 500,
                                cursor: 'pointer',
                                backgroundColor: isSelected ? `${content.course.color || '#3b82f6'}15` : 'transparent',
                                color: isSelected ? (content.course.color || '#0f172a') : '#475569',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={(e) => {
                                  if(!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                              }}
                              onMouseOut={(e) => {
                                  if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ marginTop: '2px', minWidth: '18px' }}>
                                  {lesson.completed_at ? (
                                      <CheckCircle size={18} color="#10b981" />
                                  ) : isSelected ? (
                                      <PlayCircle size={18} color={content.course.color || '#3b82f6'} />
                                  ) : (
                                      <Circle size={18} color="#cbd5e1" />
                                  )}
                              </div>
                              <span style={{ lineHeight: '1.4' }}>{lesson.title}</span>
                            </button>
                          )})}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {selectedLesson ? (
            <motion.div 
               key={selectedLesson.id}
               className="glass-card lesson-card" 
               style={{ 
                 padding: 'clamp(1.25rem, 5vw, 3rem)', 
                 display: 'flex', 
                 flexDirection: 'column', 
                 border: '1px solid #e2e8f0', 
                 minHeight: '400px' 
               }}
               initial={{ opacity: 0, y: 20, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            >
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>{selectedLesson.title}</h2>
              
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '12px' }}>
                {['theory', 'exercises', 'exam'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      border: 'none',
                      background: tab === t ? '#fff' : 'none',
                      borderRadius: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      color: tab === t ? (content.course.color || '#3b82f6') : '#64748b',
                      boxShadow: tab === t ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                      transition: 'all 0.3s ease',
                      fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {t === 'theory' ? '📖 Teoría' : t === 'exercises' ? '📝 Práctica' : '🎯 Examen'}
                  </button>
                ))}
              </div>

              {/* Dynamic Content */}
              <div style={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab + selectedLesson.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    {tab === 'theory' && (
                      <div style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.theory_content || selectedLesson.content || '<p style="color:#64748b">Contenido en preparación para esta lección...</p>' }} />
                        {selectedLesson.video_url && (
                          <div style={{ marginTop: '2rem', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#000' }}>
                             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                Video: {selectedLesson.video_url}
                             </div>
                          </div>
                        )}
                        <div style={{ marginTop: '3rem' }}>
                           <Button onClick={async () => {
                               try {
                                   await api.post(`/student/lessons/${selectedLesson.id}/read`);
                               } catch (e) { console.error('Error marking read:', e); }
                               setTab('exercises');
                           }}>
                               Entendido, ir a Ejercicios
                           </Button>
                        </div>
                      </div>
                    )}
                    {tab === 'exercises' && (
                       <QuizView
                           lessonId={selectedLesson.id}
                           type="exercise"
                           color={content.course.color}
                           initialData={selectedLesson.exercise_score !== null ? {
                               score: selectedLesson.exercise_score,
                               passed: selectedLesson.exercise_score >= 12,
                               correctCount: selectedLesson.exercise_score / 2, // 2 pts por pregunta
                               totalCount: 10
                           } : null}
                           onComplete={(res) => { 
                               selectedLesson.exercise_score = res.score;
                           }}
                       />
                    )}
                    {tab === 'exam' && (
                       <QuizView
                           lessonId={selectedLesson.id}
                           type="exam"
                           color={content.course.color}
                           initialData={selectedLesson.exam_score !== null ? {
                               score: selectedLesson.exam_score,
                               passed: selectedLesson.exam_score >= 12,
                               correctCount: selectedLesson.exam_score, // 1 pt por pregunta
                               totalCount: 20
                           } : null}
                           onComplete={(res) => {
                               selectedLesson.exam_score = res.score;
                               if (res.passed) {
                                   selectedLesson.completed_at = new Date().toISOString();
                               }
                           }}
                       />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#94a3b8' }}
            >
              <div style={{ padding: '2rem', borderRadius: '50%', background: '#f8fafc', marginBottom: '2rem' }}>
                  <GraduationCap size={80} color="#cbd5e1" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Selecciona una lección</h3>
              <p style={{ fontSize: '1.1rem' }}>Explora el syllabus en la barra lateral para comenzar a aprender.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseContentView;
