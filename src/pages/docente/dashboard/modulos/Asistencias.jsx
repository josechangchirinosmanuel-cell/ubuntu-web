import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, MessageSquare, History, CheckCircle2, Filter, Search, Calendar, User as UserIcon } from 'lucide-react';
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

const Asistencias = () => {
  const [activeTab, setActiveTab] = useState('diaria'); // 'diaria' o 'historial'
  const [students, setStudents] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, studentId: null, name: '', reason: '' });
  
  // Filtros Historial
  const [filters, setFilters] = useState({
    studentId: 'all',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const months = [
    { v: 1, l: 'Enero' }, { v: 2, l: 'Febrero' }, { v: 3, l: 'Marzo' }, 
    { v: 4, l: 'Abril' }, { v: 5, l: 'Mayo' }, { v: 6, l: 'Junio' }, 
    { v: 7, l: 'Julio' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Septiembre' }, 
    { v: 10, l: 'Octubre' }, { v: 11, l: 'Noviembre' }, { v: 12, l: 'Diciembre' }
  ];

  const years = [2024, 2025, 2026];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes] = await Promise.all([
        api.get('/teacher/attendance/today')
      ]);
      setStudents(studentsRes.data.data.students);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const params = new URLSearchParams();
      if (filters.studentId !== 'all') params.append('studentId', filters.studentId);
      if (filters.month !== 'all') params.append('month', filters.month);
      if (filters.year !== 'all') params.append('year', filters.year);

      const response = await api.get(`/teacher/attendance/history?${params.toString()}`);
      setHistoryRecords(response.data.data.records);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'diaria') {
      fetchData();
    } else {
      fetchHistory();
    }
  }, [activeTab]);

  const handleStatusChange = (studentId, newStatus) => {
    if (newStatus === 'absent') {
      const student = students.find(s => s.id === studentId);
      setModalData({ 
        isOpen: true, 
        studentId, 
        name: `${student.first_name} ${student.last_name}`,
        reason: student.today_reason || ''
      });
    }

    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, today_status: newStatus } : s
    ));
  };

  const saveReason = () => {
    setStudents(prev => prev.map(s => 
      s.id === modalData.studentId ? { ...s, today_reason: modalData.reason } : s
    ));
    setModalData({ ...modalData, isOpen: false });
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const attendanceRecords = students
        .filter(s => s.today_status)
        .map(s => ({
          studentId: s.id,
          status: s.today_status,
          reason: s.today_reason
        }));

      await api.post('/teacher/attendance/save', { attendanceRecords });
      await fetchData();
      alert('¡Asistencia guardada con éxito!');
    } catch (error) {
      alert('Error al guardar la asistencia');
    } finally {
      setSaving(false);
    }
  };

  const currentCounters = students.reduce((acc, s) => {
    if (s.today_status) acc[s.today_status]++;
    return acc;
  }, { present: 0, late: 0, absent: 0 });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Tabs Professional Design */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f1f5f9', padding: '0.4rem', borderRadius: '14px', width: 'fit-content' }}>
        <button 
          onClick={() => setActiveTab('diaria')}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: activeTab === 'diaria' ? 'white' : 'transparent',
            color: activeTab === 'diaria' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'diaria' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <CheckCircle2 size={18} /> Pase de Lista
        </button>
        <button 
          onClick={() => setActiveTab('historial')}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: activeTab === 'historial' ? 'white' : 'transparent',
            color: activeTab === 'historial' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'historial' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <History size={18} /> Historial
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'diaria' ? (
          <motion.div 
            key="diaria" 
            variants={containerVariants}
            initial="hidden" 
            animate="visible" 
            exit={{ opacity: 0 }}
          >
            {/* Stats Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                { label: 'Presentes', value: currentCounters.present, color: '#10b981' },
                { label: 'Tardanzas', value: currentCounters.late, color: '#8b5cf6' },
                { label: 'Faltas', value: currentCounters.absent, color: '#ef4444' },
                { label: 'Total Alumnos', value: students.length, color: '#3b82f6' }
              ].map((c, i) => (
                <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{c.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c.color }}>{loading ? '...' : c.value}</div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Toma de Asistencia - Hoy</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Puedes modificar la asistencia y volver a guardar si cometiste un error.</p>
                </div>
                <button 
                  onClick={handleSaveAll}
                  disabled={saving || loading}
                  className="btn-premium" 
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (saving || loading) ? 0.7 : 1 }}
                >
                  <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left' }}>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ESTUDIANTE</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>ACCIONES (P / T / F)</th>
                      <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'right' }}>MOTIVO / NOTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando alumnos...</td></tr>
                    ) : students.length === 0 ? (
                      <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No hay alumnos asignados a este curso.</td></tr>
                    ) : (
                      students.map(student => (
                        <motion.tr key={student.id} variants={itemVariants} style={{ background: '#f8fafc', borderRadius: '12px' }}>
                          <td style={{ padding: '1rem', fontWeight: 700, borderRadius: '12px 0 0 12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{student.last_name}, {student.first_name}</span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DNI: {student.dni}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                {[
                                  { id: 'present', label: 'P', color: '#10b981', title: 'Presente' },
                                  { id: 'late', label: 'T', color: '#8b5cf6', title: 'Tarde' },
                                  { id: 'absent', label: 'F', color: '#ef4444', title: 'Falta' }
                                ].map(opt => (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleStatusChange(student.id, opt.id)}
                                    style={{
                                      width: '42px', height: '42px', borderRadius: '12px', border: '2px solid',
                                      borderColor: student.today_status === opt.id ? opt.color : '#e2e8f0',
                                      background: student.today_status === opt.id ? `${opt.color}15` : '#ffffff',
                                      color: student.today_status === opt.id ? opt.color : '#94a3b8',
                                      fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                                      boxShadow: student.today_status === opt.id ? `0 4px 12px ${opt.color}20` : 'none'
                                    }}
                                  >{opt.label}</button>
                                ))}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                            <button 
                              onClick={() => {
                                const s = students.find(x => x.id === student.id);
                                setModalData({ isOpen: true, studentId: student.id, name: `${s.first_name} ${s.last_name}`, reason: s.today_reason || '' });
                              }} 
                              style={{ background: 'none', border: 'none', color: student.today_reason ? '#3b82f6' : '#94a3b8', cursor: 'pointer', padding: '0.5rem' }}
                            >
                              <MessageSquare size={20} fill={student.today_reason ? 'currentColor' : 'none'} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="historial" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {/* Historical Filters */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
               <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <UserIcon size={14} /> ESTUDIANTE
                  </label>
                  <select 
                    value={filters.studentId}
                    onChange={(e) => setFilters({...filters, studentId: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                  >
                     <option value="all">Todos los alumnos</option>
                     {students.map(s => <option key={s.id} value={s.id}>{s.last_name}, {s.first_name}</option>)}
                  </select>
               </div>

               <div style={{ width: '180px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <Calendar size={14} /> MES
                  </label>
                  <select 
                    value={filters.month}
                    onChange={(e) => setFilters({...filters, month: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                  >
                     <option value="all">Todos los meses</option>
                     {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                  </select>
               </div>

               <div style={{ width: '120px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <Calendar size={14} /> AÑO
                  </label>
                  <select 
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                  >
                     {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
               </div>

               <button 
                onClick={fetchHistory}
                className="btn-premium" 
                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
               >
                 <Search size={18} /> Buscar
               </button>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Resultados del Historial</h3>
               
               <div style={{ overflowX: 'auto' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                       <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                          <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>FECHA</th>
                          <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ALUMNO</th>
                          <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>ESTADO</th>
                          <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>OBSERVACIÓN</th>
                       </tr>
                    </thead>
                    <tbody>
                       {historyLoading ? (
                         <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>Buscando registros...</td></tr>
                       ) : historyRecords.length === 0 ? (
                         <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No se encontraron asistencias con estos filtros.</td></tr>
                       ) : (
                         historyRecords.map(record => (
                           <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>{new Date(record.date).toLocaleDateString()}</td>
                              <td style={{ padding: '1rem' }}>
                                 <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{record.last_name}, {record.first_name}</div>
                                 <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DNI: {record.dni}</div>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                 <span style={{
                                    padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800,
                                    background: record.status === 'present' ? '#dcfce7' : record.status === 'late' ? '#f3e8ff' : '#fee2e2',
                                    color: record.status === 'present' ? '#166534' : record.status === 'late' ? '#6b21a8' : '#991b1b'
                                 }}>
                                    {record.status === 'present' ? 'PRESENTE' : record.status === 'late' ? 'TARDE' : 'FALTA'}
                                 </span>
                              </td>
                              <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748b' }}>{record.reason || '-'}</td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={modalData.isOpen} onClose={() => setModalData({ ...modalData, isOpen: false })} title="Motivo de la Falta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Registrar observación para <strong>{modalData.name}</strong>:</div>
           <textarea value={modalData.reason} onChange={(e) => setModalData({ ...modalData, reason: e.target.value })} placeholder="Ej: Salud, Problemas familiares..." style={{ width: '100%', height: '120px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', fontSize: '0.9rem', resize: 'none' }} />
           <button onClick={saveReason} className="btn-premium" style={{ padding: '1rem', borderRadius: '12px', fontWeight: 800 }}>Confirmar Motivo</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Asistencias;
