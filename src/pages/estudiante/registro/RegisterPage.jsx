import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    dni: '',
    phone: '',
    birth_date: '',
    role: 'student' // Fixed for this portal
  });

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validaciones en tiempo real
    if (name === 'first_name' || name === 'last_name') {
      // Solo letras y espacios, convertir a Mayúsculas
      newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '').toUpperCase();
    } else if (name === 'dni') {
      // Solo números, máx 8 dígitos
      newValue = value.replace(/\D/g, '').slice(0, 8);
    } else if (name === 'phone') {
      // Solo números, máx 9 dígitos
      newValue = value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData({ ...formData, [name]: newValue });
    setFormErrors({ ...formErrors, [name]: '' }); // Limpiar error de este campo al escribir
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, first_name, last_name, dni, phone, birth_date, password, confirmPassword } = formData;
    let isValid = true;
    const newErrors = {};

    // Validar campos vacíos (pasamos `true` en lugar de texto para evitar el mensaje debajo del input)
    if (!first_name) newErrors.first_name = true;
    if (!last_name) newErrors.last_name = true;
    if (!email) newErrors.email = true;
    if (!dni) newErrors.dni = true;
    if (!phone) newErrors.phone = true;
    if (!birth_date) newErrors.birth_date = true;
    if (!password) newErrors.password = true;
    if (!confirmPassword) newErrors.confirmPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setError('Por favor, completa todos los campos obligatorios.');
      return false;
    }

    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
      isValid = false;
    }

    // Validar DNI (8 dígitos)
    if (dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
      isValid = false;
    }

    // Validar Teléfono (9 dígitos)
    if (phone.length !== 9) {
      newErrors.phone = 'El teléfono debe tener exactamente 9 dígitos';
      isValid = false;
    }

    // Validar Edad (Mínimo 10 años)
    if (birth_date) {
      const birthDateObj = new Date(birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }

      if (age < 10) {
        newErrors.birth_date = 'Debes tener al menos 10 años para registrarte.';
        isValid = false;
      }
    }

    // Validar Contraseñas coinciden
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(newErrors);
      setError('Por favor revisa los errores en el formulario.');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/estudiante/login', { state: { message: 'Registro exitoso. Ahora puedes iniciar sesión.' } });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Cuenta de Estudiante"
      subtitle="Únete a la red de voluntarios más grande del Perú"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Nombre"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="JUAN"
            required
            error={formErrors.first_name}
          />
          <Input
            label="Apellido"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="PÉREZ"
            required
            error={formErrors.last_name}
          />
        </div>

        <Input
          label="Email Personal"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan.perez@correo.com"
          required
          error={formErrors.email}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="DNI"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="12345678"
            required
            error={formErrors.dni}
          />
          <Input
            label="Teléfono"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="987654321"
            required
            error={formErrors.phone}
          />
        </div>

        <Input
          label="Fecha de Nacimiento"
          type="date"
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          required
          error={formErrors.birth_date}
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
        <Input
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          showPasswordToggle
          error={formErrors.confirmPassword}
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
          Crear mi Cuenta
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ¿Ya tienes cuenta? {' '}
        <Link to="/estudiante/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
