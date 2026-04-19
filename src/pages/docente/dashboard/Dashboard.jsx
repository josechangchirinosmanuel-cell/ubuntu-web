import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import TeacherLayout from '../../../layouts/TeacherLayout';

// Import Modulos
import Inicio from './modulos/Inicio';
import AlumnosList from './modulos/Alumnos';
import Asistencias from './modulos/Asistencias';
import Progreso from './modulos/Progreso';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState('inicio');

  const renderModule = () => {
    switch (activeModule) {
      case 'inicio': return <Inicio user={user} />;
      case 'alumnos': return <AlumnosList />;
      case 'asistencias': return <Asistencias />;
      case 'progreso': return <Progreso />;
      default: return <Inicio user={user} />;
    }
  };

  return (
    <TeacherLayout activeModule={activeModule} setActiveModule={setActiveModule}>
      <AnimatePresence mode="wait">
        <motion.div
           key={activeModule}
           initial={{ opacity: 0, scale: 0.99 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 1.01 }}
           transition={{ duration: 0.2 }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </TeacherLayout>
  );
};

export default Dashboard;
