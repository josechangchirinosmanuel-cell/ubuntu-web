import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  GraduationCap, 
  Gamepad2, 
  FolderOpen, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  Target, 
  LogOut, 
  Menu, 
  X,
  User,
  Bell
} from 'lucide-react';

const DashboardLayout = ({ children, activeModule, setActiveModule }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const studentLinks = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'cursos', label: 'Mis Cursos', icon: <GraduationCap size={20} /> },
    { id: 'juegos', label: 'Juegos', icon: <Gamepad2 size={20} /> },
    { id: 'recursos', label: 'Recursos', icon: <FolderOpen size={20} /> },
  ];

  const teacherLinks = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'alumnos', label: 'Mis Alumnos', icon: <Users size={20} /> },
    { id: 'asistencia', label: 'Asistencia', icon: <ClipboardCheck size={20} /> },
    { id: 'progreso', label: 'Progreso', icon: <BarChart3 size={20} /> },
    { id: 'notas', label: 'Notas', icon: <Target size={20} /> },
  ];

  const navLinks = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className={`dashboard-container ${isMobileOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar with Premium Floating Style */}
      <aside className={`dashboard-sidebar ${isCollapsed ? 'is-collapsed' : ''}`} style={{
        marginTop: '1.25rem',
        marginLeft: '1.25rem',
        marginBottom: '1.25rem',
        height: 'calc(100vh - 2.5rem)',
        borderRadius: 'var(--border-radius-premium)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)'
      }}>
        <div className="sidebar-header" style={{ padding: '0 2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            overflow: 'hidden' 
          }}>
            <div style={{ 
              minWidth: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800
            }}>U</div>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              color: 'var(--primary)', 
              whiteSpace: 'nowrap',
              display: isCollapsed ? 'none' : 'block'
            }}>
              UBUNTU
            </h2>
          </div>
        </div>
        
        <nav className="sidebar-nav" style={{ padding: '1.5rem 1rem' }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-item ${activeModule === link.id ? 'active' : ''}`}
              onClick={() => {
                setActiveModule(link.id);
                setIsMobileOpen(false);
              }}
              title={isCollapsed ? link.label : ''}
              style={{
                padding: isCollapsed ? '0.75rem' : '0.875rem 1.25rem',
                borderRadius: '12px',
                marginBottom: '0.5rem'
              }}
            >
              <div className="nav-icon" style={{ 
                color: activeModule === link.id ? 'var(--primary)' : 'var(--text-muted)' 
              }}>
                {link.icon}
              </div>
              {!isCollapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{link.label}</span>}
              {activeModule === link.id && !isCollapsed && (
                <div style={{ 
                  marginLeft: 'auto', 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)' 
                }}></div>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={logout} 
            className="nav-item" 
            style={{ 
              color: '#f43f5e',
              background: 'rgba(244, 63, 94, 0.05)',
              borderRadius: '12px'
            }} 
            title={isCollapsed ? 'Cerrar sesión' : ''}
          >
            <div className="nav-icon"><LogOut size={20} /></div>
            {!isCollapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`dashboard-main ${isCollapsed ? 'is-collapsed' : ''}`} style={{
        marginLeft: isCollapsed ? 'calc(var(--sidebar-collapsed-width) + 1.25rem)' : 'calc(var(--sidebar-width) + 1.25rem)',
        paddingRight: '1.25rem'
      }}>
        <header className="dashboard-header" style={{
          background: 'transparent',
          border: 'none',
          padding: '1.25rem 1rem',
          height: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              className="menu-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{ 
                width: '40px', 
                height: '40px', 
                boxShadow: 'var(--shadow-sm)',
                background: 'white',
                border: '1px solid var(--border)'
              }}
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ubuntu Platform
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {navLinks.find(l => l.id === activeModule)?.label || 'Panel'}
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'white', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <Bell size={20} />
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '0.5rem',
              paddingLeft: '1rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user?.first_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{user?.role.toUpperCase()}</div>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content" style={{ padding: '0 1rem 2rem 1rem' }}>
          {children}
        </div>
      </main>

      <style>{`
        .dashboard-main {
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 1024px) {
          .dashboard-main { 
            margin-left: 0 !important;
            padding-left: 1.25rem;
          }
          .dashboard-sidebar {
            position: fixed;
            left: -320px;
            z-index: 100;
          }
          .sidebar-open .dashboard-sidebar {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
