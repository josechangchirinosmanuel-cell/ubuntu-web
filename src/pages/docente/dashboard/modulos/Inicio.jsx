import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardCheck, TrendingUp, AlertCircle, BarChart, Activity } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart as ReBarChart, Bar, Cell
} from 'recharts';
import api from '../../../../services/api';
import FondoDocente from '../../../../assets/FondoDocente.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f87171'];

const Inicio = ({ user }) => {
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, total: 0, pending: 0 });
  const [chartData, setChartData] = useState({ attendanceTrends: [], performanceDistribution: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          api.get('/teacher/attendance/stats'),
          api.get('/teacher/dashboard/charts')
        ]);
        setStats(statsRes.data.data);
        setChartData(chartsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Matrícula Total', value: stats.total, sub: 'Alumnos asignados', icon: <Users size={28}/>, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Asistencia Hoy', value: stats.present, sub: 'Llegaron a tiempo', icon: <ClipboardCheck size={28}/>, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Tardanzas', value: stats.late, sub: 'Llegaron tarde', icon: <TrendingUp size={28}/>, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Faltas Hoy', value: stats.absent, sub: `${stats.pending} sin registrar`, icon: <AlertCircle size={28}/>, color: '#f59e0b', bg: '#fffbeb' }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ position: 'relative' }}>
      
      {/* Hero Welcome Section */}
      <motion.div variants={itemVariants} style={{
         position: 'relative',
         borderRadius: '32px',
         overflow: 'hidden',
         marginBottom: '4rem',
         boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.2)'
      }}>
         {/* Background Image Layer */}
         <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${FondoDocente})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%'
         }} />
         
         {/* Premium Overlay Filter */}
         <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.8) 100%)',
            backdropFilter: 'blur(2px)'
         }} />

         <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
               Bienvenido, Prof. {user?.last_name || 'Docente'}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', maxWidth: '650px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
               Aquí tienes un resumen actualizado del rendimiento de tus alumnos, asistencias y métricas en tiempo real.
            </p>
         </div>
      </motion.div>

      {/* Stat Cards Flowing Over Hero (Negative Margin) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '-8rem', position: 'relative', zIndex: 10, padding: '0 1.5rem', marginBottom: '3rem' }}>
         {statCards.map((stat, i) => (
           <motion.div 
             key={i} 
             variants={itemVariants} 
             whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
             style={{ 
                 padding: '1.75rem', 
                 background: 'rgba(255, 255, 255, 0.9)', 
                 backdropFilter: 'blur(10px)',
                 borderRadius: '24px', 
                 border: '1px solid rgba(255,255,255,0.5)',
                 borderLeft: `6px solid ${stat.color}`,
                 boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                 transition: 'all 0.3s ease'
             }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <div style={{ color: stat.color, background: stat.bg, padding: '0.75rem', borderRadius: '12px' }}>
                    {stat.icon}
                 </div>
                 <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                    {stat.sub}
                 </div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {loading ? '...' : stat.value}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 700, marginTop: '0.5rem' }}>
                  {stat.label}
              </div>
           </motion.div>
         ))}
      </div>

      {/* Analytics Graphics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
         
         {/* Area Chart: Attendance Trend */}
         <motion.div variants={itemVariants} style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
               <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '14px', color: '#3b82f6' }}>
                  <Activity size={24} />
               </div>
               <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Historial de Asistencia Semanal</h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Seguimiento general de participación</p>
               </div>
            </div>
            
            <div style={{ height: '350px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="day_label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 600 }}
                     />
                     <Area type="monotone" dataKey="present" name="Presentes" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* Bar Chart: Performance Distribution */}
         <motion.div variants={itemVariants} style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
               <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '14px', color: '#f59e0b' }}>
                  <BarChart size={24} />
               </div>
               <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Desempeño Académico</h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Distribución actual de las evaluaciones</p>
               </div>
            </div>

            <div style={{ height: '350px', width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData.performanceDistribution} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} width={130} tick={{fontSize: 12, fontWeight: 700, fill: '#475569'}} />
                     <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                     <Bar dataKey="student_count" name="Alumnos" radius={[0, 8, 8, 0]} barSize={24}>
                        {chartData.performanceDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Bar>
                  </ReBarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>
         
      </div>
    </motion.div>
  );
};

export default Inicio;
