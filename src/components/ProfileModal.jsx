import { useEffect, useRef, useState } from 'react';
import { User, X, Camera, Mail, Loader2, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { STATUS_OPTIONS, getStatusMeta } from '../utils/status';
import { getInitials } from '../utils/profile';

const DESCRIPTION_MAX = 200;

export default function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    setFotoFile(file);
    setFotoPreviewUrl(URL.createObjectURL(file));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !form.skills.includes(value)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError('');
    try {
      await onSave(form, fotoFile);
      onClose();
    } catch {
      setSubmitError('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = fotoPreviewUrl || form.foto_url;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-title">
            <User size={16} strokeWidth={2.5} />
            Editar perfil
          </span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="profile-modal-avatar-section">
            <div className="profile-modal-avatar">
              {avatarSrc ? <img src={avatarSrc} alt="" /> : <span>{getInitials(form.nombre)}</span>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="upload-zone-input"
              onChange={handlePhotoChange}
            />
            <button type="button" className="btn-change-photo" onClick={() => fileInputRef.current?.click()}>
              <Camera size={13} strokeWidth={2} />
              Cambiar foto
            </button>
          </div>

          <div className="field">
            <label>Nombre completo</label>
            <input type="text" value={form.nombre} onChange={update('nombre')} placeholder="ej: Jose Chipana" />
          </div>

          <div className="field-row-2">
            <div className="field">
              <label>Carrera</label>
              <input type="text" value={form.carrera} onChange={update('carrera')} />
            </div>
            <div className="field">
              <label>Semestre</label>
              <input type="text" value={form.semestre} onChange={update('semestre')} />
            </div>
          </div>

          <div className="field">
            <label>Universidad</label>
            <input type="text" value={form.universidad} onChange={update('universidad')} />
          </div>

          <div className="field">
            <label>Ciudad y país</label>
            <input type="text" value={form.ciudad} onChange={update('ciudad')} placeholder="ej: Cañete, Perú" />
          </div>

          <hr className="modal-divider modal-divider-inline" />

          <div className="field">
            <label>Estado</label>
            <div className="status-select-wrap">
              <span className="status-dot" style={{ background: getStatusMeta(form.disponibilidad).color }} />
              <select value={form.disponibilidad} onChange={update('disponibilidad')}>
                {STATUS_OPTIONS.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="modal-divider modal-divider-inline" />

          <div className="field">
            <label>GitHub</label>
            <div className="input-icon-group">
              <GithubIcon width={15} height={15} />
              <input type="url" value={form.github} onChange={update('github')} placeholder="https://github.com/..." />
            </div>
          </div>
          <div className="field">
            <label>LinkedIn</label>
            <div className="input-icon-group">
              <LinkedinIcon width={15} height={15} />
              <input
                type="url"
                value={form.linkedin}
                onChange={update('linkedin')}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
          <div className="field">
            <label>Correo</label>
            <div className="input-icon-group">
              <Mail size={15} strokeWidth={2} />
              <input type="email" value={form.email} onChange={update('email')} placeholder="tu@email.com" />
            </div>
          </div>

          <hr className="modal-divider modal-divider-inline" />

          <div className="field">
            <label>Skills</label>
            <div className="chip-row">
              {form.skills.map((skill) => (
                <span className="skill-chip-editable" key={skill}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Eliminar ${skill}`}>
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
            <div className="skill-add-row">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="ej: Docker"
              />
              <button type="button" className="btn-add-skill" onClick={addSkill}>
                Agregar
              </button>
            </div>
          </div>

          <hr className="modal-divider modal-divider-inline" />

          <div className="field">
            <label>Descripción</label>
            <textarea
              rows={3}
              maxLength={DESCRIPTION_MAX}
              value={form.descripcion}
              onChange={update('descripcion')}
              placeholder="Cuéntanos sobre ti..."
            />
            <span className="char-counter">
              {form.descripcion.length} / {DESCRIPTION_MAX}
            </span>
          </div>

          {submitError && <p className="modal-error">{submitError}</p>}

          <div className="modal-footer">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} strokeWidth={2.5} className="spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  Guardar perfil
                </>
              )}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
