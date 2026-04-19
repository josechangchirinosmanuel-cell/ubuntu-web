import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Explicitly login as teacher for this portal
    const result = await login(formData.email, formData.password, 'teacher');
    
    if (result.success) {
      navigate('/docente/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Portal del Docente" 
      subtitle="Accede a tus herramientas de enseñanza y gestión"
    >

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Institucional"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="profesor@ubuntu.edu.pe"
          required
        />
        
        <Input
          label="Contraseña"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fff1f2', 
            border: '1px solid #ffe4e6', 
            borderRadius: 'var(--radius-md)',
            color: '#e11d48',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          <Link 
            to="/docente/olvido-password" 
            style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Ingresar al Portal
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        Si no tienes una cuenta aún, {' '}
        <Link to="/docente/registro" style={{ color: 'var(--primary)', fontWeight: '700' }}>
          Regístrate aquí
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
