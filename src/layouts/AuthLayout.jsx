import React from 'react';
import authVisual from '../assets/auth-visual-blue.png';
import logoUrl from '../assets/Logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-split-container">
      {/* Visual Side (Left) */}
      <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
        {/* Dynamic Mesh Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${authVisual})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          filter: 'saturate(1.2) contrast(1.1)',
          zIndex: 0
        }}></div>
        
        <div className="blob" style={{ top: '-10%', left: '-10%', background: 'rgba(255, 255, 255, 0.15)' }}></div>
        <div className="blob" style={{ bottom: '10%', right: '-5%', width: '300px', height: '300px', animationDelay: '-2s', background: 'rgba(6, 182, 212, 0.2)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, animation: 'slideInUp 1s ease-out' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'white', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>U</span>
          </div>
          
          <h1 style={{ fontSize: '4rem', lineHeight: '1', color: 'white', marginBottom: '1.5rem', fontWeight: '900', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Transformando <br /> vidas a través <br /> de la <span style={{ color: 'var(--secondary)' }}>educación</span>.
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', maxWidth: '540px', lineHeight: '1.6', fontWeight: '500' }}>
            Únete a Ubuntu Jóvenes Voluntarios del Perú y sé parte del cambio que nuestro país necesita.
          </p>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>500+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '600' }}>Voluntarios</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>10k+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '600' }}>Estudiantes</div>
            </div>
          </div>
        </div>
        
        {/* Modern footer on visual side */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '4rem', zIndex: 1, display: 'flex', gap: '1rem', opacity: 0.7 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em' }}>#UBUNTUPERU</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em' }}>#VOLUNTARIADO</span>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="auth-form-side">
        <div className="auth-card-v2">
          <div style={{ marginBottom: '2.5rem' }}>
             {/* Official Logo Display */}
             <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <img src={logoUrl} alt="Ubuntu Logo" style={{ height: '70px', objectFit: 'contain' }} />
             </div>
             
             <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.025em', textAlign: 'center' }}>{title}</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', textAlign: 'center' }}>{subtitle}</p>
          </div>
          
          {children}
          
          <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', fontWeight: '500' }}>
            © {new Date().getFullYear()} Ubuntu Jóvenes Voluntarios del Perú. <br />
            Construyendo el futuro, hoy.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-only { display: block !important; margin-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
