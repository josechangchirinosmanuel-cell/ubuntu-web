import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, Calculator, Globe, Code, FlaskConical, Library } from 'lucide-react';
import api from '../../../../services/api';


// Helper to assign colors based on category
const getCategoryColor = (category) => {
    switch(category) {
        case 'Ciencias Exactas': return '#3b82f6'; // blue
        case 'Historia': return '#f59e0b'; // amber
        case 'Literatura': return '#ec4899'; // pink
        case 'Ciencias Naturales': return '#10b981'; // green
        case 'Tecnología': return '#8b5cf6'; // purple
        case 'Lenguaje': return '#06b6d4'; // cyan
        case 'Idiomas': return '#ef4444'; // red
        default: return '#64748b'; // slate
    }
};

// Helper for dynamic icons
const getIconComponent = (iconName, size) => {
    switch (iconName) {
        case 'Globe': return <Globe size={size} />;
        case 'BookOpen': return <BookOpen size={size} />;
        case 'Calculator': return <Calculator size={size} />;
        case 'Library': return <Library size={size} />;
        case 'FileText': return <FileText size={size} />;
        case 'Code': return <Code size={size} />;
        case 'FlaskConical': return <FlaskConical size={size} />;
        default: return <FileText size={size} />;
    }
};

const Recursos = () => {
  const [recursosList, setRecursosList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        if (res.data.success) {
          setRecursosList(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
      return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: '#64748b' }}>
              <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                  <Library size={48} color="#3b82f6" opacity={0.5} />
              </motion.div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sincronizando con Base de Datos...</h2>
          </div>
      );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div>
         <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Library size={36} color="#3b82f6" />
            Biblioteca de Recursos
         </h1>
         <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, maxWidth: '800px' }}>
            Descarga materiales de lectura, libros y guías de estudio suplementarias gestionadas dinámicamente desde el servidor central.
         </p>
      </div>

      {/* Grid of PDFs */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
      }}>
        {recursosList.map((recurso, index) => {
            const color = getCategoryColor(recurso.category);
            
            return (
              <motion.div
                key={recurso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.5rem',
                  cursor: 'default',
                  border: `1px solid ${color}30`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ y: -5, boxShadow: `0 15px 25px -5px ${color}20` }}
              >
                  {/* Decorative background blur */}
                  <div style={{
                      position: 'absolute', top: '-10px', right: '-10px',
                      background: color, opacity: 0.05,
                      width: '100px', height: '100px',
                      borderRadius: '50%', filter: 'blur(20px)',
                      pointerEvents: 'none'
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{
                          width: '56px', height: '56px', borderRadius: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                          color: color, boxShadow: `0 4px 10px ${color}15`
                      }}>
                          {getIconComponent(recurso.icon_type, 32)}
                      </div>

                      <span style={{
                          background: `${color}15`, color: color,
                          padding: '0.25rem 0.75rem', borderRadius: '100px',
                          fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                      }}>
                          {recurso.category}
                      </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {recurso.title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                      <FileText size={16} /> Base de Datos • {recurso.size}
                  </div>

                  {/* Download Button */}
                  <a 
                      href={recurso.url} 
                      download={recurso.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                          marginTop: 'auto',
                          background: 'white',
                          color: color,
                          border: `2px solid ${color}`,
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                          e.currentTarget.style.background = color;
                          e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = color;
                      }}
                  >
                      <Download size={20} />
                      Acceder a Recurso
                  </a>
              </motion.div>
            );
        })}
      </div>
    </div>
  );
};

export default Recursos;
