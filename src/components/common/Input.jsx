import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error,
  showPasswordToggle = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determinar el tipo real del input
  const inputType = type === 'password' && showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label 
          htmlFor={id} 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: 'var(--text-main)' 
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: showPasswordToggle && type === 'password' ? '0.75rem 3rem 0.75rem 1rem' : '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            backgroundColor: '#fff',
            fontSize: '1rem',
            color: 'var(--text-main)',
            transition: 'var(--transition)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'var(--shadow-sm)';
          }}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && typeof error === 'string' && (
        <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
