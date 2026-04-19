import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, Lock, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import logoUrl from '../../assets/Logo.png';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateStrength = (pass) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    };
  };

  const strength = validateStrength(password);
  const allValid = Object.values(strength).every(Boolean) && password === confirmPassword && confirmPassword !== '';

  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setStep(2);
        setTimer(120);
        setCanResend(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      if (response.data.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/reset-password', { email, code, password });
      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
    handleRequestReset();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', // Fondo azul cielo muy claro
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Fondos Decorativos Suaves */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ position: 'absolute', top: '-5%', right: '10%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '50%', filter: 'blur(60px)' }} 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '5%', left: '5%', width: '350px', height: '350px', background: 'rgba(129, 140, 248, 0.15)', borderRadius: '50%', filter: 'blur(50px)' }} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          maxWidth: '520px',
          width: '100%',
          zIndex: 10
        }}
      >
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '40px',
          padding: '4rem 3.5rem',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
             <motion.div whileHover={{ scale: 1.05 }} style={{ marginBottom: '2.5rem' }}>
                <img src={logoUrl} alt="Ubuntu Logo" style={{ width: '150px' }} />
             </motion.div>

             {/* Progress bar subtle */}
             <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{
                    width: s === step ? '35px' : '10px',
                    height: '8px',
                    borderRadius: '10px',
                    background: s <= step ? '#3b82f6' : '#e2e8f0',
                    transition: 'all 0.5s ease'
                  }} />
                ))}
             </div>

             <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', margin: 0 }}>
               {step === 1 && 'Recuperar Cuenta'}
               {step === 2 && 'Código de Seguridad'}
               {step === 3 && 'Actualizar Contraseña'}
             </h2>
             <p style={{ color: '#64748b', marginTop: '0.85rem', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
               {step === 1 && 'Ingresa tu correo para recibir las instrucciones de recuperación.'}
               {step === 2 && 'Verifica tu bandeja de entrada e ingresa el código.'}
               {step === 3 && 'Introduce una nueva contraseña para tu cuenta.'}
             </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#fff1f2',
                border: '1px solid #ffe4e6',
                padding: '1rem',
                borderRadius: '16px',
                color: '#e11d48',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem'
              }}
            >
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.form 
                 key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 onSubmit={handleRequestReset}
               >
                 <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                       <Mail size={22} />
                    </div>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      style={lightInputStyle}
                    />
                 </div>
                 <div style={{ marginTop: '2.5rem' }}>
                    <Button fullWidth loading={loading} type="submit" size="large">
                        Enviar Código Seguro
                    </Button>
                 </div>
                 <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}>
                       <ArrowLeft size={18} /> Volver al Inicio
                    </Link>
                 </div>
               </motion.form>
             )}

             {step === 2 && (
               <motion.form 
                 key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 onSubmit={handleVerifyCode}
               >
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <input
                        type="text" maxLength={4} value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="0000"
                        style={{
                          width: '100%', maxWidth: '250px',
                          background: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '20px',
                          color: '#3b82f6',
                          fontSize: '3.5rem',
                          textAlign: 'center',
                          letterSpacing: '12px',
                          outline: 'none',
                          fontWeight: 900,
                          padding: '1rem'
                        }}
                      />
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
                        padding: '0.75rem 1.5rem', background: '#f1f5f9', borderRadius: '15px' 
                      }}>
                         <RefreshCw size={18} className={timer > 0 ? "spin-pulse" : ""} style={{ color: timer > 0 ? '#3b82f6' : '#ef4444' }} />
                         <span style={{ color: timer > 0 ? '#1e293b' : '#ef4444', fontWeight: 800, fontSize: '1rem' }}>
                            {timer > 0 ? formatTime(timer) : "Expiró"}
                         </span>
                      </div>
                      
                      {canResend && (
                        <motion.button 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          type="button" onClick={handleResend}
                          style={{ display: 'block', margin: '1.2rem auto 0', background: 'none', border: 'none', color: '#3b82f6', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Reenviar nuevo código
                        </motion.button>
                      )}
                  </div>

                  <Button fullWidth loading={loading} type="submit" size="large" disabled={code.length !== 4}>
                     Verificar Código
                  </Button>
               </motion.form>
             )}

             {step === 3 && (
               <motion.form 
                 key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                 onSubmit={handleResetPassword}
               >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Lock size={22} /></div>
                        <input
                          type="password" placeholder="Nueva Contraseña"
                          value={password} onChange={e => setPassword(e.target.value)}
                          style={lightInputStyle}
                        />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><ShieldCheck size={22} /></div>
                        <input
                          type="password" placeholder="Confirmar Contraseña"
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          style={lightInputStyle}
                        />
                      </div>
                  </div>

                  <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
                    padding: '1.75rem', background: '#f8fafc', borderRadius: '24px', 
                    border: '1px solid #e2e8f0', marginBottom: '3rem'
                  }}>
                      <SmallCheck valid={strength.length} text="8+ Caract." />
                      <SmallCheck valid={strength.upper} text="Mayúscula" />
                      <SmallCheck valid={strength.lower} text="Minúscula" />
                      <SmallCheck valid={strength.number} text="Número" />
                      <SmallCheck valid={strength.special} text="Símbolo" />
                      <SmallCheck valid={password === confirmPassword && confirmPassword !== ''} text="Coinciden" />
                  </div>

                  <Button fullWidth loading={loading} type="submit" size="large" disabled={!allValid}>
                     Restablecer Contraseña
                  </Button>
               </motion.form>
             )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success Modal Light */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              style={{
                maxWidth: '460px', width: '90%', padding: '4rem 3rem', background: '#ffffff',
                borderRadius: '40px', textAlign: 'center', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ 
                width: '90px', height: '90px', background: '#f0fdf4', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', color: '#16a34a' 
              }}>
                 <CheckCircle2 size={50} />
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem' }}>¡Éxito Total!</h2>
              <p style={{ color: '#64748b', fontSize: '1.15rem', marginBottom: '3.5rem', lineHeight: 1.6 }}>
                Tu contraseña ha sido actualizada. Ya puedes volver a disfrutar de la plataforma.
              </p>
              <Button fullWidth size="large" onClick={() => navigate('/login')}>
                Ingresar Ahora
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin-pulse { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};

const lightInputStyle = {
  width: '100%',
  padding: '1.25rem 1.25rem 1.25rem 3.5rem',
  background: '#ffffff',
  border: '2px solid #e2e8f0',
  borderRadius: '18px',
  color: '#0f172a',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};

const SmallCheck = ({ valid, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: valid ? '#059669' : '#94a3b8' }}>
    <CheckCircle2 size={16} style={{ opacity: valid ? 1 : 0.4 }} />
    <span style={{ fontWeight: 800 }}>{text}</span>
  </div>
);

export default ForgotPasswordPage;
