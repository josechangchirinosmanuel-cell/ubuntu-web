import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type === 'error') setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
    }

    if (!token) {
      return setStatus({ type: 'error', message: 'Token de recuperación no válido' });
    }

    setLoading(true);
    const result = await resetPassword(token, formData.password);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'Contraseña restablecida correctamente.' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Nueva contraseña" 
      subtitle="Ingresa tu nueva contraseña para recuperar el acceso"
    >
      {!token ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fef2f2', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--error)',
            marginBottom: '1.5rem'
          }}>
            El enlace de recuperación no es válido o está incompleto.
          </div>
          <Link to="/forgot-password" style={{ display: 'block' }}>
            <Button variant="secondary" fullWidth>Solicitar nuevo enlace</Button>
          </Link>
        </div>
      ) : status.type === 'success' ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '3.5rem', 
            height: '3.5rem', 
            borderRadius: '50%', 
            backgroundColor: '#ecfdf5', 
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.5rem'
          }}>
            ✓
          </div>
          <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>
            {status.message}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Nueva contraseña"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {status.type === 'error' && (
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fee2e2', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {status.message}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Restablecer contraseña
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
