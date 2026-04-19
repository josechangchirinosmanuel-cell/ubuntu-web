import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', onClick, disabled = false, fullWidth = false, loading = false }) => {
  const baseStyles = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    opacity: (disabled || loading) ? 0.7 : 1,
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#fff',
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-muted)',
      border: '1.5px solid var(--border)'
    }
  };

  const currentStyles = { ...baseStyles, ...variants[variant] };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={currentStyles}
      onMouseOver={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.filter = 'brightness(1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {loading ? (
        <span className="spinner" style={{
          width: '1.25rem',
          height: '1.25rem',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></span>
      ) : children}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
