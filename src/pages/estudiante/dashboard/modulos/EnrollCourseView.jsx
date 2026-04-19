import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../../services/api';
import Button from '../../../../components/common/Button';

const EnrollCourseView = ({ onEnrolled, onBack }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const response = await api.get('/student/available-courses');
        if (response.data.success) {
          setCourses(response.data.data.courses);
        }
      } catch (err) {
        console.error('Error fetching available courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailable();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const response = await api.post('/student/enroll', { courseId });
      if (response.data.success) {
        onEnrolled();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error al inscribirse');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando cursos disponibles...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 900, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Explorar Nuevos Cursos
        </h2>
        <Button onClick={onBack} variant="outline" size="small">Volver</Button>
      </div>

      <div className="course-grid">
        {courses.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
              <h3 style={{ color: '#64748b', fontSize: '1.25rem' }}>No hay más cursos disponibles por ahora. ¡Ya estás matriculado en todo!</h3>
          </div>
        ) : (
          courses.map(course => (
             <motion.div 
               key={course.id} 
               whileHover={{ y: -10, boxShadow: '0 25px 30px -5px rgba(0,0,0,0.1)' }}
               className="glass-card" 
               style={{ 
                   padding: 0, 
                   overflow: 'hidden', 
                   borderRadius: '32px',
                   display: 'flex',
                   flexDirection: 'column',
                   height: '100%' 
               }}
             >
               <div style={{ 
                 height: '200px', 
                 overflow: 'hidden',
                 position: 'relative',
                 background: '#f8fafc'
               }}>
                 <img 
                   src={course.image_url ? `${import.meta.env.BASE_URL}${course.image_url.replace(/^\//, '')}` : `${import.meta.env.BASE_URL}assets/hero.png`} 
                   alt={course.name}
                   style={{ 
                     width: '100%', 
                     height: '100%', 
                     objectFit: 'cover',
                   }}
                   onError={(e) => {
                     e.target.src = `${import.meta.env.BASE_URL}assets/hero.png`;
                   }}
                 />
                 <div style={{ 
                   position: 'absolute', 
                   bottom: 0, 
                   left: 0, 
                   right: 0, 
                   background: 'linear-gradient(to top, rgba(255,255,255,1), transparent)',
                   height: '60px'
                 }} />
               </div>
               
               <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <h3 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>{course.name}</h3>
                 <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6, flex: 1 }}>
                    Aprende {course.name} de la mano de los mejores voluntarios de Ubuntu. 
                 </p>
                 <Button fullWidth onClick={() => handleEnroll(course.id)} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                     Inscribirme Gratis
                 </Button>
               </div>
             </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnrollCourseView;
