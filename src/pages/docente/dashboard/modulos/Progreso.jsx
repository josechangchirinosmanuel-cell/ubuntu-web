import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, Plus, Trash2, Save, Award, TrendingUp, ClipboardList } from 'lucide-react';
import api from '../../../../services/api';
import Modal from '../../../../components/common/Modal';

// ─── Helpers ────────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score === null || score === undefined) return '#94a3b8';
  if (score >= 15) return '#22c55e';
  if (score >= 11) return '#f59e0b';
  return '#ef4444';
};

const scoreLabel = (score) => {
  if (score === null || score === undefined) return 'Sin nota';
  if (score >= 15) return 'Bueno';
  if (score >= 11) return 'Regular';
  return 'En riesgo';
};

const TypeBadge = ({ type }) => {
  const map = {
    examen:    { bg: '#ede9fe', color: '#7c3aed', label: 'Examen' },
    ejercicio: { bg: '#e0f2fe', color: '#0369a1', label: 'Ejercicio' },
    tarea:     { bg: '#fef3c7', color: '#92400e', label: 'Tarea' },
  };
  const s = map[type] || map.ejercicio;
  return (
    <span style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const SourceBadge = ({ source }) => {
  if (source === 'auto') {
    return (
      <span style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', marginLeft: '0.5rem' }}>
        SISTEMA
      </span>
    );
  }
  return null;
};

// ─── Componente principal ────────────────────────────────────────
const Progreso = () => {
  const [view, setView] = useState('overview'); // 'overview' | 'libreta'
  const [students, setStudents]   = useState([]);
  const [activities, setActivities] = useState([]);
  const [selected, setSelected]   = useState(null);  // alumno seleccionado
  const [libreta, setLibreta]     = useState(null);   // { student, activities }
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', type: 'ejercicio', description: '' });
  const [activeWeek, setActiveWeek] = useState(1);

  // ── Carga de datos ──
  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const [progressRes, activitiesRes] = await Promise.all([
        api.get('/teacher/progress'),
        api.get('/teacher/activities'),
      ]);
      setStudents(progressRes.data.data.students);
      setActivities(activitiesRes.data.data.activities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  const fetchLibreta = async (student) => {
    try {
      setLoading(true);
      setSelected(student);
      const res = await api.get(`/teacher/progress/${student.id}/libreta`);
      setLibreta(res.data.data);
      setView('libreta');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Guardar nota ──
  const handleScoreChange = (activityId, value) => {
    setLibreta(prev => ({
      ...prev,
      activities: prev.activities.map(a =>
        a.activity_id === activityId ? { ...a, score: value } : a
      )
    }));
  };

  const handleSaveGrade = async (activityId, score, comments) => {
    if (score === '' || score === null) return;
    setSaving(true);
    try {
      await api.post('/teacher/progress/grade', {
        studentId: selected.id,
        activityId,
        score: parseFloat(score),
        comments
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Crear actividad ──
  const handleCreateActivity = async () => {
    if (!newActivity.title.trim()) return;
    try {
      await api.post('/teacher/activities', newActivity);
      setActivityModal(false);
      setNewActivity({ title: '', type: 'ejercicio', description: '' });
      fetchOverview();
    } catch (e) {
      alert('Error al crear la actividad');
    }
  };

  // ── Eliminar actividad ──
  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('¿Eliminar esta actividad y todas sus notas?')) return;
    await api.delete(`/teacher/activities/${activityId}`);
    fetchOverview();
  };

  // ═══════════════════════════════════════════════════════════════
  // VISTA: OVERVIEW
  // ═══════════════════════════════════════════════════════════════
  if (view === 'overview') return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Progreso Académico</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
            Visualiza el avance y rendimiento de tus alumnos.
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Alumnos',    value: students.length,                                         icon: <BookOpen size={24} />,     color: '#3b82f6' },
          { label: 'Actividades',      value: activities.length,                                       icon: <ClipboardList size={24} />, color: '#8b5cf6' },
          { label: 'Alumnos en Riesgo', value: students.filter(s => s.average_score !== null && s.average_score < 11).length, icon: <TrendingUp size={24} />, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e293b' }}>{loading ? '…' : s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de alumnos */}
      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ALUMNO</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>PROMEDIO</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>CALIFICADAS</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>ESTADO</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>LIBRETA</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Cargando...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Sin alumnos registrados aún.</td></tr>
            ) : students.map(student => {
              const avg   = student.average_score;
              const color = scoreColor(avg);
              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ background: '#f8fafc' }}
                >
                  <td style={{ padding: '1rem', fontWeight: 700, borderRadius: '12px 0 0 12px' }}>{student.full_name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{avg ?? '—'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.25rem' }}>/20</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                    {student.graded_count} / {student.total_activities}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, background: `${color}15`, color }}>
                      {scoreLabel(avg)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                    <button
                      onClick={() => fetchLibreta(student)}
                      style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <BookOpen size={14} /> Ver Libreta
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal crear actividad */}
      <Modal isOpen={activityModal} onClose={() => setActivityModal(false)} title="Nueva Actividad">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Título *</label>
            <input
              value={newActivity.title}
              onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
              placeholder="Ej: Examen Parcial 1"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Tipo *</label>
            <select
              value={newActivity.type}
              onChange={e => setNewActivity({ ...newActivity, type: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', background: 'white' }}
            >
              <option value="ejercicio">Ejercicio</option>
              <option value="examen">Examen</option>
              <option value="tarea">Tarea</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Descripción (opcional)</label>
            <input
              value={newActivity.description}
              onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
              placeholder="Breve descripción..."
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.4rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <button onClick={handleCreateActivity} className="btn-premium" style={{ padding: '1rem', borderRadius: '10px', fontWeight: 800 }}>
            Crear Actividad
          </button>
        </div>
      </Modal>
    </motion.div>
  );

  // ═══════════════════════════════════════════════════════════════
  // VISTA: LIBRETA INDIVIDUAL (JERÁRQUICA POR SEMANAS)
  // ═══════════════════════════════════════════════════════════════
  
  // Agrupar lecciones por semana
  const groupedLessons = libreta?.lessons?.reduce((acc, lesson) => {
    const week = lesson.week_number || 0;
    if (!acc[week]) acc[week] = [];
    acc[week].push(lesson);
    return acc;
  }, {}) || {};

  const weeksList = Object.keys(groupedLessons).sort((a, b) => a - b);

  const calculateLessonAvg = (ex, exam) => {
    if (ex === null && exam === null) return null;
    if (ex === null) return parseFloat(exam).toFixed(1);
    if (exam === null) return parseFloat(ex).toFixed(1);
    return ((parseFloat(ex) + parseFloat(exam)) / 2).toFixed(1);
  };

  if (view === 'libreta') return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Nav & Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <button
          onClick={() => { setView('overview'); setLibreta(null); fetchOverview(); setActiveWeek(1); }}
          style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>
            Libreta: {libreta?.student?.full_name}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontWeight: 500 }}>{libreta?.student?.email}</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '0.75rem 1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promedio General</div>
          <div style={{ fontSize: '2rem', fontWeight: 950, color: scoreColor(selected?.average_score) }}>{selected?.average_score || '—'}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>Cargando información detallada...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* SELECTOR DE SEMANAS (CARDS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '0.5rem', borderRadius: '8px' }}><Award size={20} /></div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 850, color: '#334155' }}>Selecciona una Semana</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {weeksList.length > 0 ? (
                  weeksList.map(week => {
                    const isActive = parseInt(activeWeek) === parseInt(week);
                    const lessonCount = groupedLessons[week].length;
                    const completedCount = groupedLessons[week].filter(l => l.completed_at).length;
                    const isFullyCompleted = completedCount === lessonCount;

                    return (
                        <motion.div
                          key={week}
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveWeek(parseInt(week))}
                          style={{
                              padding: '1.5rem',
                              borderRadius: '20px',
                              background: isActive ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#ffffff',
                              border: isActive ? 'none' : '1px solid #e2e8f0',
                              boxShadow: isActive ? '0 10px 20px rgba(59, 130, 246, 0.25)' : '0 2px 4px rgba(0,0,0,0.02)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden'
                          }}
                        >
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isActive ? '#bfdbfe' : '#64748b', marginBottom: '0.5rem' }}>SEMANA</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: isActive ? '#ffffff' : '#1e293b' }}>{week}</div>
                            
                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: isActive ? '#ffffff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                {isFullyCompleted ? (
                                    <span style={{ color: isActive ? '#ffffff' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Award size={14} /> Completada
                                    </span>
                                ) : (
                                    <span>{completedCount}/{lessonCount} Clases</span>
                                )}
                            </div>

                            {isActive && (
                                <motion.div 
                                  layoutId="activeGlow"
                                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)' }}
                                />
                            )}
                        </motion.div>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    No hay lecciones registradas en este curso.
                  </div>
                )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {groupedLessons[activeWeek] && (
              <motion.div 
                key={activeWeek}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderLeft: '4px solid #3b82f6', borderRadius: '0 8px 8px 0', marginBottom: '1.5rem', fontWeight: 800, color: '#1e293b', fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>DETALLE DE CLASES - SEMANA {activeWeek}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{groupedLessons[activeWeek].length} Clases encontradas</span>
                </div>
                
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '1.25rem 1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>CLASE</th>
                        <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>FECHA COMPLETADA</th>
                        <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>NOTA EJERCICIO</th>
                        <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>NOTA EXAMEN</th>
                        <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>PROM. CLASE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedLessons[activeWeek].map((lesson, idx) => {
                        const lessonAvg = calculateLessonAvg(lesson.exercise_score, lesson.exam_score);
                        return (
                            <tr key={idx} style={{ borderBottom: idx === groupedLessons[activeWeek].length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{lesson.title}</td>
                            <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                                {lesson.completed_at ? new Date(lesson.completed_at).toLocaleDateString() : 'Pendiente'}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: scoreColor(lesson.exercise_score) }}>{lesson.exercise_score ?? '—'}</span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: scoreColor(lesson.exam_score) }}>{lesson.exam_score ?? '—'}</span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center', background: '#fafafa' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 950, color: scoreColor(lessonAvg), padding: '0.3rem 0.8rem', background: `${scoreColor(lessonAvg)}15`, borderRadius: '10px' }}>
                                {lessonAvg ?? '—'}
                                </span>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECCIÓN 2: ACTIVIDADES DEL DOCENTE (Opcional, si existen) */}
          {libreta?.manualActivities?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.5rem', borderRadius: '8px' }}><ClipboardList size={20} /></div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 850, color: '#334155' }}>Actividades Manuales del Docente</h4>
              </div>

              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '1.25rem 1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVIDAD</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>FECHA</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>NOTA</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>COMENTARIO</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libreta.manualActivities.map((act, idx) => (
                      <tr key={idx} style={{ borderBottom: idx === libreta.manualActivities.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>{act.title}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                          {act.graded_at ? new Date(act.graded_at).toLocaleDateString() : 'Pendiente'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <input
                            type="number" min="0" max="20" step="0.5"
                            value={act.score ?? ''}
                            onChange={e => {
                               setLibreta(prev => ({
                                 ...prev,
                                 manualActivities: prev.manualActivities.map(a => 
                                   a.activity_id === act.activity_id ? { ...a, score: e.target.value } : a
                                 )
                               }));
                            }}
                            style={{ width: '60px', padding: '0.4rem', textAlign: 'center', borderRadius: '8px', border: `2px solid ${scoreColor(act.score)}`, fontWeight: 800, color: scoreColor(act.score) }}
                          />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <input
                            type="text" value={act.comments ?? ''}
                            onChange={e => {
                               setLibreta(prev => ({
                                 ...prev,
                                 manualActivities: prev.manualActivities.map(a => 
                                   a.activity_id === act.activity_id ? { ...a, comments: e.target.value } : a
                                 )
                               }));
                            }}
                            placeholder="Añadir comentario..."
                            style={{ width: '100%', padding: '0.4rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          />
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                           <button 
                             onClick={() => handleSaveGrade(act.activity_id, act.score, act.comments)}
                             disabled={saving}
                             style={{ background: '#f0fdf4', color: '#16a34a', border: 'none', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                           >
                             <Save size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Progreso;
