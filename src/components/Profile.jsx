import { Pencil, GraduationCap, Briefcase, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { getStatusMeta } from '../utils/status';
import { getInitials } from '../utils/profile';
import { formatMonthYear } from '../utils/date';
import { workTypes } from '../data/projects';

const DESCRIPTION_HIGHLIGHT = 'DentalAI';

function DescriptionWithHighlight({ text, highlight }) {
  if (!highlight || !text.includes(highlight)) {
    return <p className="profile-description">{text}</p>;
  }
  const idx = text.indexOf(highlight);
  const before = text.slice(0, idx);
  const after = text.slice(idx + highlight.length);
  return (
    <p className="profile-description">
      {before}
      <strong className="profile-description-highlight">{highlight}</strong>
      {after}
    </p>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-key">{label}</span>
      <span className="info-row-val">{value}</span>
    </div>
  );
}

function ProfileHeroSkeleton() {
  return (
    <div className="profile-hero profile-hero-skeleton">
      <div className="profile-hero-top">
        <div className="skeleton profile-avatar-box" />
        <div className="profile-hero-skeleton-lines">
          <div className="skeleton skeleton-line" style={{ width: 110, height: 12 }} />
          <div className="skeleton skeleton-line" style={{ width: 200, height: 26 }} />
          <div className="skeleton skeleton-line" style={{ width: 160, height: 18 }} />
          <div className="skeleton skeleton-line" style={{ width: 240, height: 12 }} />
        </div>
      </div>
    </div>
  );
}

export default function Profile({ profile, projects, loading, onEditProfile, editMode }) {
  if (loading || !profile) {
    return (
      <section className="profile-page">
        <ProfileHeroSkeleton />
      </section>
    );
  }

  const status = getStatusMeta(profile.disponibilidad);
  const skills = profile.skills ?? [];
  const ultimoTrabajo = projects.length > 0 ? projects[0] : null;
  const ultimoTipoMeta = ultimoTrabajo ? workTypes.find((t) => t.id === ultimoTrabajo.tipo) : null;

  const stats = [
    { value: projects.length, label: 'Trabajos' },
    { value: projects.filter((p) => p.tipo === 'articulo').length, label: 'Artículos' },
    { value: projects.filter((p) => p.tipo === 'documento').length, label: 'Documentos' },
    { value: projects.filter((p) => p.tipo === 'logro').length, label: 'Logros' },
  ];

  return (
    <section className="profile-page">
      <div className="profile-hero">
        {editMode && (
          <button type="button" className="profile-edit-btn" onClick={onEditProfile}>
            <Pencil size={12} strokeWidth={2} />
            Editar perfil
          </button>
        )}

        <div className="profile-hero-top">
          <div className="profile-avatar-box">
            {profile.foto_url ? <img src={profile.foto_url} alt={profile.nombre} /> : getInitials(profile.nombre)}
          </div>

          <div className="profile-hero-info">
            <span className="profile-status">
              <span className="profile-status-dot" style={{ background: status.color }} />
              {profile.disponibilidad}
            </span>
            <h1 className="profile-name">{profile.nombre}</h1>
            <p className="profile-tagline">{profile.carrera}</p>
            <p className="profile-meta">
              {profile.universidad} · {profile.semestre} · {profile.ciudad}
            </p>
          </div>
        </div>

        <hr className="profile-hero-divider" />

        <DescriptionWithHighlight text={profile.descripcion} highlight={DESCRIPTION_HIGHLIGHT} />

        <div className="chip-row profile-skill-row">
          {skills.map((skill) => (
            <span className="profile-hero-chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="profile-stats">
        {stats.map((stat) => (
          <div className="profile-stat" key={stat.label}>
            <span className="profile-stat-value">{stat.value}</span>
            <span className="profile-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="profile-cards-row">
        <div className="profile-card">
          <p className="profile-card-title">
            <GraduationCap size={13} strokeWidth={2} />
            Datos académicos
          </p>
          <InfoRow label="Universidad" value={profile.universidad} />
          <InfoRow label="Carrera" value={profile.carrera} />
          <InfoRow label="Semestre" value={profile.semestre} />
          <InfoRow label="Ubicación" value={profile.ciudad} />
        </div>

        <div className="profile-card">
          <p className="profile-card-title">
            <Briefcase size={13} strokeWidth={2} />
            Último trabajo
          </p>
          {ultimoTrabajo ? (
            <>
              <InfoRow label="Título" value={ultimoTrabajo.titulo} />
              <InfoRow
                label="Tipo"
                value={
                  <span
                    className="type-chip"
                    style={{ background: ultimoTipoMeta?.bg, color: ultimoTipoMeta?.text }}
                  >
                    {ultimoTipoMeta?.label ?? ultimoTrabajo.tipo}
                  </span>
                }
              />
              <InfoRow label="Fecha" value={formatMonthYear(ultimoTrabajo.fecha)} />
            </>
          ) : (
            <p className="profile-empty-hint">Aún no hay trabajos agregados</p>
          )}
        </div>
      </div>

      <div className="profile-card profile-presence-card">
        <p className="profile-card-title">Presencia online</p>
        <div className="profile-presence-row">
          <button
            type="button"
            className="profile-presence-btn"
            disabled={!profile.github}
            onClick={() => profile.github && window.open(profile.github, '_blank', 'noreferrer')}
          >
            <GithubIcon color="#185FA5" />
            GitHub
          </button>
          <button
            type="button"
            className="profile-presence-btn"
            disabled={!profile.linkedin}
            onClick={() => profile.linkedin && window.open(profile.linkedin, '_blank', 'noreferrer')}
          >
            <LinkedinIcon color="#185FA5" />
            LinkedIn
          </button>
          <button
            type="button"
            className="profile-presence-btn"
            disabled={!profile.email}
            onClick={() => profile.email && window.open(`mailto:${profile.email}`, '_blank')}
          >
            <Mail size={16} strokeWidth={2} color="#185FA5" />
            Correo
          </button>
        </div>
      </div>

      <div className="profile-card">
        <p className="profile-card-title">Stack tecnológico</p>
        <div className="chip-row">
          {skills.map((skill) => (
            <span className="profile-skill-chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
