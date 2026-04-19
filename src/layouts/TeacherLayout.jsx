import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  User,
  Bell,
  Settings
} from 'lucide-react';

import FondoDocente2 from '../assets/FondoDocente2.jpg';
import LogoUrl from '../assets/Logo.png';
import IconoUrl from '../assets/icono.png';

const TeacherLayout = ({ children, activeModule, setActiveModule }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/docente/login');
  };
  
  const navLinks = [
    { id: 'inicio', label: 'Panel Principal', icon: <Home size={20} /> },
    { id: 'asistencias', label: 'Asistencias', icon: <ClipboardCheck size={20} /> },
    { id: 'alumnos', label: 'Mis Estudiantes', icon: <Users size={20} /> },
    { id: 'progreso', label: 'Progreso Académico', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className={`dashboard-container ${isMobileOpen ? 'sidebar-open' : ''}`} style={{ 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Dynamic Background Effect */}
      <div style={{
         position: 'fixed',
         inset: 0,
         backgroundImage: `url(${FondoDocente2})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         zIndex: 0
      }} />
      <div style={{
         position: 'fixed',
         inset: 0,
         backgroundColor: 'rgba(255, 255, 255, 0.75)',
         backdropFilter: 'blur(8px)',
         WebkitBackdropFilter: 'blur(8px)',
         zIndex: 1
      }} />

      {/* Sidebar - Professional Style */}
      <aside className={`dashboard-sidebar ${isCollapsed ? 'is-collapsed' : ''}`} style={{
         backgroundColor: '#1e293b', // Slate 800 (Lighter than Slate 900)
         color: 'white',
         width: isCollapsed ? '80px' : '280px',
         position: 'fixed',
         zIndex: 50
      }}>
        <div className="sidebar-header" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={LogoUrl} 
            alt="Ubuntu Logo" 
            style={{ 
              width: '60%', 
              maxWidth: '130px',
              objectFit: 'contain',
              display: isCollapsed ? 'none' : 'block',
              filter: 'drop-shadow(0px 2px 8px rgba(255,255,255,0.15))'
            }} 
          />
          {isCollapsed && (
            <img 
              src={IconoUrl} 
              alt="Ubuntu Icon" 
              style={{ 
                width: '40px', 
                height: '40px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0px 2px 8px rgba(255,255,255,0.15))'
              }} 
            />
          )}
        </div>
        
        <nav className="sidebar-nav" style={{ padding: '3rem 1.25rem' }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-item ${activeModule === link.id ? 'active' : ''}`}
              onClick={() => {
                setActiveModule(link.id);
                setIsMobileOpen(false);
              }}
              style={{
                color: activeModule === link.id ? 'white' : '#94a3b8',
                background: activeModule === link.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                borderLeft: activeModule === link.id ? '3px solid #38bdf8' : '3px solid transparent',
                padding: '1rem 1.25rem',
                marginBottom: '0.5rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div className="nav-icon" style={{ color: activeModule === link.id ? '#38bdf8' : 'inherit' }}>
                {link.icon}
              </div>
              {!isCollapsed && <span style={{ fontWeight: 600 }}>{link.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} className="nav-item" style={{ 
              color: '#f87171', padding: '0.75rem', width: '100%',
              display: 'flex', alignItems: 'center', gap: '1rem',
              border: 'none', background: 'transparent', cursor: 'pointer'
            }}>
            <div className="nav-icon"><LogOut size={20} /></div>
            {!isCollapsed && <span style={{ fontWeight: 600 }}>Salir del Sistema</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${isCollapsed ? 'is-collapsed' : ''}`} style={{
        marginLeft: isCollapsed ? '80px' : '280px',
        width: isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)',
        position: 'relative',
        zIndex: 10
      }}>
        <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', padding: '0 2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 40 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <Menu size={24} />
              </button>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                {navLinks.find(l => l.id === activeModule)?.label}
              </h1>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <button style={{ background: 'none', border: 'none', color: '#64748b' }}><Bell size={20} /></button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{user?.first_name} {user?.last_name}</div>
                   <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>{user?.course_name || 'DOCENTE AUTORIZADO'}</div>
                </div>
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '10px', 
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b'
                }}>
                   <User size={22} />
                </div>
              </div>
           </div>
        </header>

        <div className="dashboard-content" style={{ padding: '2.5rem' }}>
          {children}
        </div>
      </main>

      <style>{`
        .dashboard-sidebar { transition: width 0.3s ease; height: 100vh; position: fixed; z-index: 50; }
        .dashboard-main { transition: margin-left 0.3s ease; min-height: 100vh; display: flex; flex-direction: column; }
        .nav-item:hover { color: white !important; background: rgba(255,255,255,0.05) !important; }
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default TeacherLayout;
