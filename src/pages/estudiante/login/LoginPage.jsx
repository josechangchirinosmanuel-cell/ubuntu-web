import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, password } = formData;
    let isValid = true;
    const newErrors = {};

    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setError('Por favor, completa todos los campos obligatorios.');
      return false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Explicitly login as student for this portal
    const result = await login(formData.email, formData.password, 'student');

    if (result.success) {
      navigate('/estudiante/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Portal del Estudiante"
      subtitle="Ingresa tus datos para continuar con tu formación"
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email del Estudiante"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="estudiante@ubuntu.edu.pe"
          required
          error={formErrors.email}
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
          showPasswordToggle
          error={formErrors.password}
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
            to="/estudiante/olvido-password"
            style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Entrar ahora
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
        ¿Aún no eres parte de la red? {' '}
        <Link to="/estudiante/registro" style={{ color: 'var(--primary)', fontWeight: '700' }}>
          Regístrate aquí
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
