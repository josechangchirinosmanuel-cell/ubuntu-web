import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, UserCheck, UserX, Search, MessageSquare } from 'lucide-react';
import api from '../../../../services/api';
import Modal from '../../../../components/common/Modal';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const AlumnosList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ isOpen: false, type: '', student: null, reason: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/students');
      setStudents(res.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openModal = (type, student) => {
    setModal({
      isOpen: true,
      type,
      student,
      reason: ''
    });
  };

  const handleConfirmAction = async () => {
    const { type, student, reason } = modal;
    try {
      if (type === 'delete') {
        await api.delete(`/teacher/students/${student.id}`, { data: { reason } });
      } else {
        const newStatus = type === 'activate' ? 1 : 2;
        await api.patch(`/teacher/students/${student.id}/status`, { status: newStatus, reason });
      }
      setModal({ ...modal, isOpen: false });
      fetchStudents();
    } catch (error) {
      alert('Error al procesar la solicitud');
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Mis Estudiantes</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
              Administra el estado y acceso de tus alumnos asignados.
            </p>
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>N°</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>NOMBRE COMPLETO</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>FECHA NAC.</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>CORREO</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>CELULAR</th>
              <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando alumnos...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No se encontraron estudiantes.</td></tr>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.tr key={student.id} variants={itemVariants} style={{ background: '#f8fafc', borderRadius: '12px' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#64748b', borderRadius: '12px 0 0 12px' }}>{index + 1}</td>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>{student.full_name}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{student.birth_date ? new Date(student.birth_date).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{student.email}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{student.phone || '-'}</td>
                  <td style={{ padding: '1rem', borderRadius: '0 12px 12px 0' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {student.status === 1 ? (
                        <button 
                          title="Desactivar"
                          onClick={() => openModal('deactivate', student)}
                          style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <UserX size={18} />
                        </button>
                      ) : (
                        <button 
                          title="Activar"
                          onClick={() => openModal('activate', student)}
                          style={{ background: '#f0fdf4', color: '#22c55e', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      <button 
                        title="Eliminar"
                        onClick={() => openModal('delete', student)}
                        style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        title={
          modal.type === 'delete' ? 'Eliminar Alumno' : 
          modal.type === 'activate' ? 'Activar Cuenta' : 'Desactivar Cuenta'
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#f1f5f9', borderRadius: '12px' }}>
            <MessageSquare size={20} style={{ color: '#3b82f6', marginTop: '0.2rem' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Estudiante: {modal.student?.full_name}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {modal.type === 'delete' 
                  ? 'Esta acción marcará al alumno como eliminado del sistema.' 
                  : 'Por favor, indica el motivo del cambio de estado.'}
              </p>
            </div>
          </div>

          <textarea
            placeholder="Escribe el motivo aquí..."
            value={modal.reason}
            onChange={(e) => setModal({ ...modal, reason: e.target.value })}
            style={{
              width: '100%',
              height: '100px',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: '0.9rem',
              resize: 'none'
            }}
          />

          <button 
            onClick={handleConfirmAction}
            className="btn-premium"
            style={{ padding: '1rem', borderRadius: '10px', fontWeight: 800 }}
          >
            Confirmar Acción
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AlumnosList;
