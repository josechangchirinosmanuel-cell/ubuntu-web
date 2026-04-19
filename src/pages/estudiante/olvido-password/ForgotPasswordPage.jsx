import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Revisa tu correo" 
        subtitle="Hemos enviado instrucciones para restablecer tu contraseña"
      >
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📧</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Si el correo <strong>{email}</strong> está registrado, 
            recibirás un enlace en los próximos minutos.
          </p>
          <Link to="/estudiante/login">
            <Button fullWidth>Volver al Login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Ingresa tu correo para recibir un enlace de recuperación"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Correo Electrónico"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="estudiante@ubuntu.edu.pe"
          required
        />

        {error && (
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
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Enviar Instrucciones
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/estudiante/login" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
