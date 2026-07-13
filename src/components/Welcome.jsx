import { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, LockOpen, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import { getInitials, abbreviate } from '../utils/profile';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function Welcome({ perfil, loading, onGuestAccess, onAdminAccess }) {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAdminAccess();
      return;
    }
    setError(true);
    setPassword('');
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const closeLogin = () => {
    setShowLogin(false);
    setPassword('');
    setError(false);
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-blob welcome-blob-1" />
      <div className="welcome-blob welcome-blob-2" />
      <div className="welcome-blob welcome-blob-3" />

      <div className="welcome-content">
        <div className="welcome-avatar-ring">
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            <div className="welcome-avatar">
              {perfil.foto_url ? (
                <img src={perfil.foto_url} alt={perfil.nombre} />
              ) : (
                <span className="welcome-avatar-fallback">{getInitials(perfil.nombre)}</span>
              )}
            </div>
          )}
        </div>

        <h1 className="welcome-name">{perfil.nombre}</h1>
        <p className="welcome-role">
          {perfil.carrera} · {abbreviate(perfil.universidad)}
        </p>
        <p className="welcome-city">
          <MapPin size={12} strokeWidth={2} />
          {perfil.ciudad}
        </p>

        <div className="welcome-divider" />

        <p className="welcome-description">{perfil.descripcion}</p>

        <div className="welcome-buttons">
          <button type="button" className="welcome-btn-guest" onClick={onGuestAccess}>
            <Eye size={16} strokeWidth={2} />
            Acceso invitado
          </button>
          <button type="button" className="welcome-btn-admin" onClick={() => setShowLogin(true)}>
            <Lock size={16} strokeWidth={2} />
            Acceso admin
          </button>
        </div>

        <p className="welcome-footer">Portafolio · 2026</p>
      </div>

      {showLogin && (
        <div className="login-overlay">
          <div className={`login-card${shake ? ' shake' : ''}`}>
            <div className="login-header">
              <div className="login-icon-box">
                <ShieldCheck size={22} strokeWidth={2} />
              </div>
              <div>
                <p className="login-title">Acceso admin</p>
                <p className="login-subtitle">Solo para el propietario</p>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle size={14} strokeWidth={2} />
                Contraseña incorrecta. Intenta de nuevo.
              </div>
            )}

            <div className="login-field">
              <label>Contraseña</label>
              <div className="login-field-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
              <p className="login-hint">Solo tú conoces esta contraseña</p>
            </div>

            <button type="button" className="login-btn-submit" onClick={handleLogin}>
              <LockOpen size={16} strokeWidth={2} />
              Entrar como admin
            </button>

            <div className="login-divider-row">
              <span className="login-divider-line" />
              <span>o</span>
              <span className="login-divider-line" />
            </div>

            <button type="button" className="login-btn-back" onClick={closeLogin}>
              <ArrowLeft size={13} strokeWidth={2} />
              Volver al portafolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
