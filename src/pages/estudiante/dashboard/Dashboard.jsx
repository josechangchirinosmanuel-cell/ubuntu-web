import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import StudentLayout from '../../../layouts/StudentLayout';

// Import Modulos
import Inicio from './modulos/Inicio';
import MisCursos from './modulos/MisCursos';
import Juegos from './modulos/Juegos';
import Recursos from './modulos/Recursos';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('inicio');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/student/dashboard-stats');
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeModule === 'inicio') {
      fetchStats();
    }
  }, [activeModule]);

  const renderModule = () => {
    switch (activeModule) {
      case 'inicio': return <Inicio user={user} stats={stats} loading={loadingStats} onNavigate={setActiveModule} />;
      case 'cursos': return <MisCursos />;
      case 'juegos': return <Juegos />;
      case 'recursos': return <Recursos />;
      default: return <Inicio user={user} onNavigate={setActiveModule} />;
    }
  };

  return (
    <StudentLayout activeModule={activeModule} setActiveModule={setActiveModule}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </StudentLayout>
  );
};

export default Dashboard;
