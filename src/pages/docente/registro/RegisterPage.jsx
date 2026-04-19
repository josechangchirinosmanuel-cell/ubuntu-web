import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import api from '../../../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    dni: '',
    phone: '',
    course_id: '',
    role: 'teacher' // Fixed for this portal
  });
  
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/auth/courses');
        if (response.data.success) {
          setCourses(response.data.data.courses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (!formData.course_id) {
      return setError('Por favor, selecciona el curso que vas a enseñar');
    }

    setLoading(true);
    
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/docente/login', { state: { message: 'Registro de docente exitoso.' } });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout 
      title="Registro de Docente" 
      subtitle="Únete a nuestra facultad de voluntarios"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Nombre"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Juan"
            required
          />
          <Input
            label="Apellido"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Pérez"
            required
          />
        </div>

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

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="course_id" style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            color: 'var(--text)' 
          }}>
            Curso que enseñarás
          </label>
          <select
            id="course_id"
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="">Selecciona un curso</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="DNI"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="12345678"
          />
          <Input
            label="Teléfono"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="987654321"
          />
        </div>

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
        <Input
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
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
          Crear Cuenta de Docente
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ¿Ya tienes cuenta? {' '}
        <Link to="/docente/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
