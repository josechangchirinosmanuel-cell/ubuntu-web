import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Docente Pages
import DocenteLogin from './pages/docente/login/LoginPage';
import DocenteRegister from './pages/docente/registro/RegisterPage';
import DocenteForgot from './pages/docente/olvido-password/ForgotPasswordPage';
import DocenteDashboard from './pages/docente/dashboard/Dashboard';

// Import Estudiante Pages
import EstudianteLogin from './pages/estudiante/login/LoginPage';
import EstudianteRegister from './pages/estudiante/registro/RegisterPage';
import EstudianteForgot from './pages/estudiante/olvido-password/ForgotPasswordPage';
import EstudianteDashboard from './pages/estudiante/dashboard/Dashboard';

// Common Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPassword/ResetPasswordPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Cargando...</div>;
  
  if (!user) {
    // Si estamos en una ruta de docente, redirigir al login de docente
    if (location.pathname.includes('/docente')) {
      return <Navigate to="/docente/login" />;
    }
    // Por defecto (o si es ruta de estudiante), al login de estudiante
    return <Navigate to="/estudiante/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    const rolePath = user.role === 'teacher' ? 'docente' : 'estudiante';
    return <Navigate to={`/${rolePath}/dashboard`} />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Estudiante Auth Routes */}
          <Route path="/estudiante/login" element={<EstudianteLogin />} />
          <Route path="/estudiante/registro" element={<EstudianteRegister />} />
          
          {/* Docente Auth Routes */}
          <Route path="/docente/login" element={<DocenteLogin />} />
          <Route path="/docente/registro" element={<DocenteRegister />} />
          {/* Common Auth Routes */}
          <Route path="/olvido-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<Navigate to="/estudiante/registro" />} />
          <Route path="/forgot-password" element={<Navigate to="/olvido-password" />} />
          <Route path="/estudiante/olvido-password" element={<Navigate to="/olvido-password" />} />
          <Route path="/docente/olvido-password" element={<Navigate to="/olvido-password" />} />
          
          {/* Protected Routes */}
          <Route 
            path="/estudiante/dashboard" 
            element={
              <ProtectedRoute allowedRole="student">
                <EstudianteDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/docente/dashboard" 
            element={
              <ProtectedRoute allowedRole="teacher">
                <DocenteDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Redirects */}
          <Route path="/login/estudiante" element={<Navigate to="/estudiante/login" />} />
          <Route path="/login/docente" element={<Navigate to="/docente/login" />} />
          <Route path="/" element={<Navigate to="/estudiante/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

