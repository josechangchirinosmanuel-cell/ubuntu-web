import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../../services/api';
import Button from '../../../../components/common/Button';
import EnrollCourseView from './EnrollCourseView';
import CourseContentView from './CourseContentView';
import Modal from '../../../../components/common/Modal';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

const MisCursos = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'enroll', 'detail'
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successConfig, setSuccessConfig] = useState({ title: '', message: '' });

  const fetchMyCourses = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const response = await api.get('/student/my-courses');
      if (response.data.success) {
        setMyCourses(response.data.data.courses);
      }
    } catch (err) {
      console.error('Error fetching my courses:', err);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleUnenroll = (e, course) => {
    e.stopPropagation();
    setCourseToUnenroll(course);
    
    // Ensure progress is checked as a number
    const progressValue = Number(course.progress || 0);
    
    if (progressValue > 0) {
      setIsConfirmOpen(true);
    } else {
      executeUnenroll(course.id);
    }
  };

  const executeUnenroll = async (courseId) => {
    setIsProcessing(true);
    try {
      await api.delete(`/student/unenroll/${courseId}`);
      // Use silent refresh to keep the modals in state
      await fetchMyCourses(true); 
      setIsConfirmOpen(false);
      setSuccessConfig({
        title: 'Curso Eliminado',
        message: '¡Curso eliminado con éxito!'
      });
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Error al unenroll:', err);
      alert('Error al darse de baja');
    } finally {
      setIsProcessing(false);
    }
  };
  const handleEnrollSuccess = () => {
    fetchMyCourses(true);
    setView('dashboard');
    setSuccessConfig({
      title: '¡Inscripción Exitosa!',
      message: 'Te has inscrito al curso con éxito. ¡A darle con todo!'
    });
    setIsSuccessOpen(true);
  };

  // Component Content based on state
  const renderContent = () => {
    // View: Loading
    if (loading && myCourses.length === 0) {
      return <div style={{ padding: '2rem' }}>Cargando tus cursos...</div>;
    }

    // View: Enrollment Selection
    if (view === 'enroll') {
      return <EnrollCourseView onEnrolled={handleEnrollSuccess} onBack={() => setView('dashboard')} />;
    }

    // View: Course Content Detail
    if (view === 'detail') {
      return <CourseContentView courseId={selectedCourseId} onBack={() => setView('dashboard')} />;
    }

    // View: Dashboard (Empty State)
    if (myCourses.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          style={{ 
            padding: '5rem 2rem', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed rgba(255, 255, 255, 0.5)'
          }}
        >
          <div style={{ fontSize: 'clamp(3rem, 15vw, 5rem)' }}>🎓</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontWeight: 900 }}>¡Bienvenido, Joven Voluntario!</h2>
          <p style={{ color: '#64748b', maxWidth: '500px', fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', fontWeight: 600, lineHeight: 1.6 }}>
            Aún no estás inscrito en ningún curso. Empieza tu viaje de aprendizaje hoy mismo.
          </p>
          <Button size="large" onClick={() => setView('enroll')}>Inscribirme Ahora</Button>
        </motion.div>
      );
    }

    // View: Dashboard (Enrolled Courses List)
    return (
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, margin: 0 }}>Mis Cursos Activos</h2>
          <Button onClick={() => setView('enroll')} variant="outline" size="small">+ Inscribirme en otro</Button>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="course-grid">
          {myCourses.map(course => (
            <motion.div 
              key={course.id} 
              variants={itemVariants} 
              whileHover={{ y: -5 }}
              onClick={() => { setSelectedCourseId(course.id); setView('detail'); }}
              className="glass-card" 
              style={{ padding: 0, overflow: 'hidden', borderRadius: '32px', cursor: 'pointer' }}
            >
              <div style={{ 
                height: '160px', 
                position: 'relative', 
                overflow: 'hidden'
              }}>
                <img 
                  src={course.image_url ? `${import.meta.env.BASE_URL}${course.image_url.replace(/^\//, '')}` : `${import.meta.env.BASE_URL}assets/hero.png`} 
                  alt={course.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = `${import.meta.env.BASE_URL}assets/hero.png`;
                  }}
                />
                <button 
                  onClick={(e) => handleUnenroll(e, course)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'rgba(254, 226, 226, 0.9)',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  Darse de baja
                </button>
              </div>
              <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
                <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.4rem)', fontWeight: 800, marginBottom: '0.5rem' }}>{course.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', fontWeight: 600 }}>Ubuntu Education Portal</p>
                
                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${course.progress || 0}%` }} 
                    transition={{ duration: 1.5, ease: "easeOut" }} 
                    style={{ height: '100%', backgroundColor: course.color || '#3b82f6' }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800 }}>
                  <span style={{ color: course.color || '#3b82f6' }}>Progreso</span>
                  <span>{course.progress || 0}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      {/* MODAL DE CONFIRMACIÓN (Con Progreso) */}
      <Modal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        title="¡Atención Estudiante!"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto', color: '#f59e0b'
          }}>
            <AlertTriangle size={40} />
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569', lineHeight: 1.5, marginBottom: '2rem' }}>
            En este curso tienes progreso acumulado. ¿Estás seguro de que deseas <span style={{ color: '#ef4444', fontWeight: 800 }}>borrar tu progreso</span> y darte de baja?
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setIsConfirmOpen(false)}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                background: 'white', color: '#64748b', fontWeight: 800, cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              onClick={() => executeUnenroll(courseToUnenroll?.id)}
              disabled={isProcessing}
              style={{ 
                flex: 1, padding: '1rem', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(to right, #ef4444, #dc2626)', color: 'white', 
                fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2)'
              }}
            >
              {isProcessing ? 'Procesando...' : 'Sí, Borrar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE ÉXITO */}
      <Modal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)}
        title={successConfig.title}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto', color: '#10b981'
          }}>
            <CheckCircle size={40} />
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>
            {successConfig.message}
          </p>
          <button 
            onClick={() => setIsSuccessOpen(false)}
            style={{ 
              width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
              background: '#0f172a', color: 'white', fontWeight: 800, cursor: 'pointer'
            }}
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MisCursos;
