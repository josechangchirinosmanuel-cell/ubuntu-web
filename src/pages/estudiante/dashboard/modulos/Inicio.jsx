import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Star, 
  ChevronRight, 
  Rocket, 
  Zap,
  Target,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const Inicio = ({ user, stats, loading, onNavigate }) => {
  const displayStats = [
    { label: 'Cursos Activos', value: stats?.activeCourses || '0', icon: <BookOpen />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Asistencia Total', value: (stats?.attendance || 0) + '%', icon: <CalendarCheck />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Logros / Medallas', value: stats?.medals || '0', icon: <Trophy />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { label: 'Puntos XP', value: stats?.xpPoints?.toLocaleString() || '0', icon: <Zap />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
  ];

  const hasCourses = stats?.activeCourses > 0;

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      {/* Background Ambient Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: 'absolute', bottom: '10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} 
        />
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Main Hero Section */}
        <motion.div variants={cardVariants}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', 
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.5rem, 5vw, 4rem)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Decorative Patterns */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="hero-content" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div className="hero-text" style={{ flex: 1, minWidth: '280px' }}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.2rem', borderRadius: '50px', color: 'white', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}
                >
                  <Sparkles size={14} /> {hasCourses ? '¡Nueva aventura disponible!' : '¡Comienza tu viaje académico!'}
                </motion.div>
                
                <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
                  Bienvenido, {user?.first_name || 'Estudiante'}
                </h1>
                <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: 'rgba(255,255,255,0.9)', maxWidth: '550px', fontWeight: 500, lineHeight: 1.5, marginBottom: '2rem' }}>
                  ¿Listo para alcanzar tus metas? {hasCourses ? (
                    <>Tienes <strong style={{ color: '#fbbf24' }}>{stats.activeCourses} cursos</strong> activos esperando por ti.</>
                  ) : (
                    <>Aún no has empezado ningún curso. ¡Inscríbete hoy!</>
                  )}
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('cursos')}
                  style={{ 
                    padding: '1rem 2rem', borderRadius: '18px', 
                    background: 'linear-gradient(to right, #f97316, #fb923c)', 
                    color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    boxShadow: '0 15px 25px -5px rgba(249, 115, 22, 0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  {hasCourses ? 'Continuar Misión' : 'Explorar Cursos'} <ChevronRight size={20} />
                </motion.button>
              </div>

              <motion.div 
                className="hero-image desktop-only"
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(40px)' }} />
                <Rocket size={120} color="white" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }} />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="stat-grid">
          {displayStats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              style={{ 
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                padding: '2rem',
                borderRadius: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: '70px', height: '70px', borderRadius: '24px', 
                backgroundColor: stat.bg, color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.25rem' }}>{stat.label}</div>
                {loading ? (
                  <div style={{ height: '2.5rem', width: '60%', background: '#f1f5f9', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
                ) : (
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{stat.value}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Inicio;
