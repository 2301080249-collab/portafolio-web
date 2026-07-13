import { useState } from 'react';
import { Code, PanelLeftClose, PanelLeftOpen, LayoutGrid, User, Plus, Pencil, Mail, Menu, X } from 'lucide-react';
import { navLinks } from '../data/projects';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { getStatusMeta } from '../utils/status';
import { getInitials, abbreviate } from '../utils/profile';

const iconMap = { LayoutGrid, User, Plus };

export default function Sidebar({ profile, activeSection, onNavigate, collapsed, onToggleCollapse, editMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const status = getStatusMeta(profile.disponibilidad);
  // Desktop "collapsed" state must not shrink the full-width mobile drawer.
  const isCollapsedView = collapsed && !mobileOpen;

  const goToProfile = () => {
    onNavigate({ id: 'perfil' });
    setMobileOpen(false);
  };

  const handleNavClick = (link) => {
    onNavigate(link);
    setMobileOpen(false);
  };

  const openSocial = (url) => {
    if (url) window.open(url, '_blank', 'noreferrer');
  };

  return (
    <>
      {!mobileOpen && (
        <button
          type="button"
          className="sidebar-mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      )}

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar${isCollapsedView ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-topbar">
            {!isCollapsedView && (
              <span className="sidebar-logo">
                <Code size={16} strokeWidth={2} />
                jose.dev
              </span>
            )}
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {collapsed ? <PanelLeftOpen size={15} strokeWidth={2} /> : <PanelLeftClose size={15} strokeWidth={2} />}
            </button>
            <button
              type="button"
              className="sidebar-mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <button type="button" className="sidebar-profile-card" onClick={goToProfile}>
            <div className="sidebar-profile-card-top">
              <div className="sidebar-avatar">
                {profile.foto_url ? (
                  <img src={profile.foto_url} alt={profile.nombre} />
                ) : (
                  <span className="avatar-initials">{getInitials(profile.nombre)}</span>
                )}
              </div>
              {!isCollapsedView && (
                <div className="sidebar-profile-text">
                  <p className="sidebar-profile-name">{profile.nombre}</p>
                  <p className="sidebar-profile-role">
                    {profile.carrera} · {abbreviate(profile.universidad)}
                    <br />
                    {profile.semestre}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsedView && (
              <>
                <div className="sidebar-profile-status">
                  <span className="sidebar-profile-status-dot" style={{ background: status.color }} />
                  <span style={{ color: status.textColor }}>{profile.disponibilidad}</span>
                </div>
                {editMode && (
                  <p className="sidebar-profile-hint">
                    <Pencil size={12} strokeWidth={2} />
                    Clic para editar perfil
                  </p>
                )}
              </>
            )}
          </button>
        </div>

        <div className="sidebar-nav-section">
          {!isCollapsedView && <p className="sidebar-section-label">Navegación</p>}
          <nav className="sidebar-nav">
            {navLinks
              .filter((link) => editMode || link.action !== 'add')
              .map((link) => {
                const Icon = iconMap[link.icon];
                const isActive = link.action !== 'add' && activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    className={`sidebar-nav-item${link.action === 'add' ? ' sidebar-nav-add' : ''}${
                      isActive ? ' active' : ''
                    }`}
                    onClick={() => handleNavClick(link)}
                    title={isCollapsedView ? link.label : undefined}
                  >
                    <Icon size={17} strokeWidth={2} />
                    {!isCollapsedView && <span>{link.label}</span>}
                  </button>
                );
              })}
          </nav>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-stack-section">
          {!isCollapsedView && <p className="sidebar-section-label">Stack técnico</p>}
          {!isCollapsedView && (
            <div className="chip-row">
              {(profile.skills ?? []).map((skill) => (
                <span className="sidebar-stack-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-social-row">
            <button
              type="button"
              className="sidebar-social-btn"
              onClick={() => openSocial(profile.github)}
              aria-label="GitHub"
            >
              <GithubIcon width={17} height={17} />
            </button>
            <button
              type="button"
              className="sidebar-social-btn"
              onClick={() => openSocial(profile.linkedin)}
              aria-label="LinkedIn"
            >
              <LinkedinIcon width={17} height={17} />
            </button>
            <button
              type="button"
              className="sidebar-social-btn"
              onClick={() => profile.email && window.open(`mailto:${profile.email}`, '_blank')}
              aria-label="Email"
            >
              <Mail size={17} strokeWidth={2} />
            </button>
          </div>
          {!isCollapsedView && <p className="sidebar-footer-text">Portafolio · 2026</p>}
        </div>
      </aside>
    </>
  );
}
