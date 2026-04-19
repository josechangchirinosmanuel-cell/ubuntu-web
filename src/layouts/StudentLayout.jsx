import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home, GraduationCap, Gamepad2, FolderOpen, LogOut, User
} from 'lucide-react';

import backgroundEstudiante from '../assets/FondoEstudiante.jpg';
import Logo from '../assets/Logo.png';

const StudentLayout = ({ children, activeModule, setActiveModule }) => {
  const { user, logout } = useAuth();

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'cursos', label: 'Mis Cursos', icon: <GraduationCap size={20} /> },
    { id: 'juegos', label: 'Juegos', icon: <Gamepad2 size={20} /> },
    { id: 'recursos', label: 'Recursos', icon: <FolderOpen size={20} /> },
  ];

  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.8), rgba(248, 250, 252, 0.8)), url(${backgroundEstudiante})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <header className="student-header" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '0 1rem', // Reduced mobile padding
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', maxHeight: '60px' }}>
          <img
            src={Logo}
            alt="Ubuntu Logo"
            className="header-logo"
            style={{
              height: '80%',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Navigation Links (Desktop Only) */}
        <nav className="desktop-only" style={{ gap: '0.5rem', alignItems: 'center', background: '#f1f5f9', padding: '0.35rem', borderRadius: '100px' }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveModule(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '100px',
                border: 'none',
                background: activeModule === link.id ? '#ffffff' : 'transparent',
                color: activeModule === link.id ? '#0f172a' : '#64748b',
                fontWeight: activeModule === link.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeModule === link.id ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.4rem 0.8rem 0.4rem 0.4rem', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            <div className="desktop-only" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{user?.first_name || 'Estudiante'}</div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700,
              padding: '0.5rem'
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-container" style={{ padding: '2rem 1rem', maxWidth: '1600px', width: '100%', margin: '0 auto', flex: 1, paddingBottom: '100px' }}>
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="bottom-nav mobile-only">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveModule(link.id)}
            className={`bottom-nav-item ${activeModule === link.id ? 'active' : ''}`}
          >
            <div className="icon-container">
              {link.icon}
            </div>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StudentLayout;
