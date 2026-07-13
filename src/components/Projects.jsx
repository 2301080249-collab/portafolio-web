import { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Microscope,
  PieChart,
  LayoutDashboard,
  Award,
  Link as LinkIcon,
  FileType,
  Image as ImageIcon,
  User,
  Calendar,
  ArrowUpRight,
  ExternalLink,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  List,
  X,
  Pencil,
  Trash2,
} from 'lucide-react';
import { workTypes } from '../data/projects';
import { formatMonthYear } from '../utils/date';
import { confirmDelete } from '../lib/alert';
import ProjectModal from './ProjectModal';
import MediaViewer from './MediaViewer';

const CARD_TYPE_META = {
  documento: {
    icon: FileText,
    bannerBg: '#0C447C',
    bannerIconColor: '#378ADD',
    label: 'Documento',
    badgeBg: 'rgba(230,241,251,0.93)',
    badgeColor: '#0C447C',
  },
  articulo: {
    icon: Microscope,
    bannerBg: '#26215C',
    bannerIconColor: '#AFA9EC',
    label: 'Artículo',
    badgeBg: 'rgba(238,237,254,0.93)',
    badgeColor: '#3C3489',
  },
  powerbi: {
    icon: PieChart,
    bannerBg: '#042C53',
    bannerIconColor: '#EF9F27',
    label: 'Power BI',
    badgeBg: 'rgba(250,238,218,0.93)',
    badgeColor: '#633806',
  },
  dashboard: {
    icon: LayoutDashboard,
    bannerBg: '#085041',
    bannerIconColor: '#5DCAA5',
    label: 'Dashboard',
    badgeBg: 'rgba(225,245,238,0.93)',
    badgeColor: '#085041',
  },
  logro: {
    icon: Award,
    bannerBg: '#412402',
    bannerIconColor: '#EF9F27',
    label: 'Logro',
    badgeBg: 'rgba(250,238,218,0.93)',
    badgeColor: '#633806',
  },
  otro: {
    icon: LinkIcon,
    bannerBg: '#0C447C',
    bannerIconColor: '#85B7EB',
    label: 'Otro',
    badgeBg: 'rgba(230,241,251,0.93)',
    badgeColor: '#0C447C',
  },
};

const TYPE_OPTIONS = [{ id: 'todos', label: 'Todos los tipos' }, ...workTypes.map((t) => ({ id: t.id, label: t.label }))];

const DATE_OPTIONS = ['Cualquier fecha', 'Este mes', 'Este año (2026)', '2025', '2024', '2023'];

const SORT_OPTIONS = [
  { value: 'Más reciente primero', short: 'Más reciente' },
  { value: 'Más antiguo primero', short: 'Más antiguo' },
  { value: 'Nombre A → Z', short: 'A → Z' },
  { value: 'Nombre Z → A', short: 'Z → A' },
];

function getBannerSrc(project) {
  if (project.portada_url) return project.portada_url;
  if (project.formato_archivo === 'Imagen' && project.archivo_url) return project.archivo_url;
  return null;
}

function getFormatChip(project) {
  if (project.tipo === 'powerbi') {
    return { icon: PieChart, label: 'Power BI', bg: '#FAEEDA', color: '#633806' };
  }
  if (project.formato_archivo === 'PDF') {
    return { icon: FileType, label: 'PDF', bg: '#E6F1FB', color: '#0C447C' };
  }
  if (project.formato_archivo === 'Word') {
    return { icon: FileType, label: 'Word', bg: '#E1F5EE', color: '#085041' };
  }
  if (project.formato_archivo === 'Imagen') {
    return { icon: ImageIcon, label: 'Imagen', bg: '#EEEDFE', color: '#3C3489' };
  }
  if (project.formato_archivo === 'Power BI') {
    return { icon: PieChart, label: 'Power BI', bg: '#FAEEDA', color: '#633806' };
  }
  if (project.link_externo) {
    return { icon: LinkIcon, label: 'Link', bg: '#E6F1FB', color: '#0C447C' };
  }
  return null;
}

function getActions(project) {
  const actions = [];

  if (project.archivo_url && project.formato_archivo === 'PDF') {
    actions.push({ kind: 'pdf', href: project.archivo_url, label: 'Abrir PDF', icon: FileType });
  }
  if (project.archivo_url && project.formato_archivo === 'Word') {
    actions.push({ kind: 'word', href: project.archivo_url, label: 'Descargar Word', icon: FileType });
  }
  if (project.archivo_url && project.formato_archivo === 'Imagen') {
    actions.push({ kind: 'image', label: 'Ver imagen', icon: ImageIcon });
  }
  if (project.formato_archivo === 'Power BI' && project.archivo_url) {
    actions.push({ kind: 'word', href: project.archivo_url, label: 'Descargar .pbix', icon: PieChart });
  }
  if (project.tipo === 'powerbi' && project.link_externo) {
    actions.push({ kind: 'embed', label: 'Ver en Power BI', icon: PieChart });
  }
  if (project.link_externo) {
    actions.push({ kind: 'link', href: project.link_externo, label: 'Abrir link externo', icon: ExternalLink });
  }

  actions.push({ kind: 'portada', label: 'Ver portada', icon: ImageIcon });

  return actions;
}

function downloadFile(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function matchesDateFilter(project, filterFecha) {
  if (filterFecha === 'Cualquier fecha') return true;
  if (!project.fecha) return false;
  const [year, month] = project.fecha.split('-').map(Number);
  if (filterFecha === 'Este mes') {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  }
  if (filterFecha === 'Este año (2026)') return year === 2026;
  return String(year) === filterFecha;
}

function sortProjects(list, sortOrder) {
  const sorted = [...list];
  switch (sortOrder) {
    case 'Más antiguo primero':
      return sorted.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
    case 'Nombre A → Z':
      return sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
    case 'Nombre Z → A':
      return sorted.sort((a, b) => b.titulo.localeCompare(a.titulo));
    case 'Más reciente primero':
    default:
      return sorted.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  }
}

function ProjectCardSkeleton() {
  return (
    <div className="project-card project-card-skeleton">
      <div className="project-card-banner skeleton" />
      <div className="project-card-body">
        <div className="skeleton skeleton-line" style={{ width: '75%', height: 16, marginBottom: 10 }} />
        <div className="skeleton skeleton-line" style={{ width: '100%', height: 11, marginBottom: 6 }} />
        <div className="skeleton skeleton-line" style={{ width: '55%', height: 11 }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, profile, onDelete, onView, onEdit, editMode }) {
  const meta = CARD_TYPE_META[project.tipo] ?? CARD_TYPE_META.otro;
  const BannerIcon = meta.icon;
  const actions = getActions(project);
  const formatChip = getFormatChip(project);
  const bannerSrc = getBannerSrc(project);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClickOutside = (e) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    const result = await confirmDelete();
    if (result.isConfirmed) onDelete(project.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(project);
  };

  const executeAction = (action) => {
    if (action.kind === 'embed') {
      onView({ mode: 'powerbi', title: project.titulo, src: project.link_externo });
    } else if (action.kind === 'image') {
      onView({ mode: 'image', title: project.titulo, src: project.archivo_url });
    } else if (action.kind === 'portada') {
      onView({ mode: 'image', title: project.titulo, src: project.portada_url || null });
    } else if (action.kind === 'word') {
      downloadFile(action.href);
    } else {
      window.open(action.href, '_blank', 'noreferrer');
    }
  };

  const handleCardClick = () => {
    if (actions.length === 1) executeAction(actions[0]);
  };

  const handleActionButtonClick = (e) => {
    e.stopPropagation();
    if (actions.length === 0) return;
    if (actions.length === 1) executeAction(actions[0]);
    else setMenuOpen((v) => !v);
  };

  const handleMenuItemClick = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    executeAction(action);
  };

  return (
    <article className="project-card" onClick={handleCardClick}>
      <div className="project-card-banner">
        {editMode && (
          <div className="card-actions">
            <button type="button" className="action-ico btn-edit" onClick={handleEdit} aria-label="Editar trabajo">
              <Pencil size={14} strokeWidth={2} />
            </button>
            <button type="button" className="action-ico btn-delete" onClick={handleDelete} aria-label="Eliminar trabajo">
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        {bannerSrc ? (
          <img className="project-card-banner-img" src={bannerSrc} alt={project.titulo} />
        ) : (
          <div className="project-card-banner-fallback" style={{ background: meta.bannerBg }}>
            <BannerIcon size={32} strokeWidth={1.75} color={meta.bannerIconColor} />
            <span style={{ color: meta.bannerIconColor }}>{meta.label}</span>
          </div>
        )}

        <span className="project-card-badge" style={{ background: meta.badgeBg, color: meta.badgeColor }}>
          <BannerIcon size={12} strokeWidth={2} />
          {meta.label}
        </span>
      </div>

      <div className="project-card-body">
        <h4 className="project-card-title">{project.titulo}</h4>
        {project.descripcion && <p className="project-card-description">{project.descripcion}</p>}

        <div className="project-card-meta-row">
          {formatChip && (
            <span className="project-card-meta-chip" style={{ background: formatChip.bg, color: formatChip.color }}>
              <formatChip.icon size={11} strokeWidth={2} />
              {formatChip.label}
            </span>
          )}
          <span className="project-card-meta-chip project-card-author-chip">
            <User size={11} strokeWidth={2} />
            {profile.nombre}
          </span>
        </div>
      </div>

      <div className="project-card-footer">
        <span className="project-card-date">
          <Calendar size={13} strokeWidth={2} />
          {formatMonthYear(project.fecha)}
        </span>
        {actions.length > 0 && (
          <div className="project-card-action-wrap" ref={menuWrapRef}>
            <button type="button" className="project-card-action-btn" onClick={handleActionButtonClick}>
              <ArrowUpRight size={14} strokeWidth={2} />
              Ver trabajo
            </button>
            {menuOpen && (
              <div className="project-card-menu">
                {actions.map((action) => (
                  <button
                    type="button"
                    key={action.kind}
                    className="project-card-menu-item"
                    onClick={(e) => handleMenuItemClick(e, action)}
                  >
                    <action.icon size={15} strokeWidth={2} />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects({
  projects,
  profile,
  loading,
  onAdd,
  onUpdate,
  onDelete,
  modalOpen,
  onCloseModal,
  editMode,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterFecha, setFilterFecha] = useState('Cualquier fecha');
  const [sortOrder, setSortOrder] = useState('Más reciente primero');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [viewer, setViewer] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  let filtered = projects;
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((p) => p.titulo.toLowerCase().includes(q));
  }
  if (filterTipo !== 'todos') {
    filtered = filtered.filter((p) => p.tipo === filterTipo);
  }
  if (filterFecha !== 'Cualquier fecha') {
    filtered = filtered.filter((p) => matchesDateFilter(p, filterFecha));
  }
  filtered = sortProjects(filtered, sortOrder);

  const activeFilterCount = (filterTipo !== 'todos' ? 1 : 0) + (filterFecha !== 'Cualquier fecha' ? 1 : 0);
  const filterTipoLabel = TYPE_OPTIONS.find((o) => o.id === filterTipo)?.label ?? filterTipo;
  const currentSortShort = SORT_OPTIONS.find((o) => o.value === sortOrder)?.short ?? sortOrder;

  const cycleSortOrder = () => {
    const idx = SORT_OPTIONS.findIndex((o) => o.value === sortOrder);
    setSortOrder(SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length].value);
  };

  const clearFilters = () => {
    setFilterTipo('todos');
    setFilterFecha('Cualquier fecha');
  };

  return (
    <section id="inicio" className="section">
      <div className="toolbar">
        <div className="toolbar-search">
          <Search size={14} strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar trabajo..."
          />
        </div>

        <button
          type="button"
          className={`toolbar-btn${showFilters ? ' active' : ''}`}
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filtros
          {activeFilterCount > 0 && <span className="toolbar-btn-badge">{activeFilterCount}</span>}
        </button>

        <button type="button" className="toolbar-btn" onClick={cycleSortOrder}>
          <ArrowUpDown size={14} strokeWidth={2} />
          {currentSortShort}
          <ChevronDown size={13} strokeWidth={2} />
        </button>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Vista de cuadrícula"
          >
            <LayoutGrid size={15} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="Vista de lista"
          >
            <List size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-panel-grid">
            <div className="filter-panel-field">
              <label>Tipo de trabajo</label>
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                {TYPE_OPTIONS.map((o) => (
                  <option value={o.id} key={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-panel-field">
              <label>Fecha</label>
              <select value={filterFecha} onChange={(e) => setFilterFecha(e.target.value)}>
                {DATE_OPTIONS.map((o) => (
                  <option value={o} key={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-panel-field">
              <label>Ordenar por</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option value={o.value} key={o.value}>
                    {o.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-panel-footer">
            <div className="active-filter-chips">
              {filterTipo !== 'todos' && (
                <span className="active-filter-chip">
                  {filterTipoLabel}
                  <button type="button" onClick={() => setFilterTipo('todos')} aria-label="Quitar filtro de tipo">
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              )}
              {filterFecha !== 'Cualquier fecha' && (
                <span className="active-filter-chip">
                  {filterFecha}
                  <button
                    type="button"
                    onClick={() => setFilterFecha('Cualquier fecha')}
                    aria-label="Quitar filtro de fecha"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && (
        <p className="results-count">
          Mostrando <strong>{filtered.length}</strong> trabajo{filtered.length === 1 ? '' : 's'}
        </p>
      )}

      {loading ? (
        <div className="project-grid">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : filtered.length > 0 ? (
        <div className={viewMode === 'grid' ? 'project-grid' : 'project-list'}>
          {filtered.map((project) => (
            <ProjectCard
              project={project}
              profile={profile}
              key={project.id}
              onDelete={onDelete}
              onView={setViewer}
              onEdit={setEditingProject}
              editMode={editMode}
            />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          {projects.length === 0
            ? 'Aún no hay trabajos. Agrega tu primer trabajo para empezar.'
            : 'No se encontraron trabajos con estos filtros.'}
        </p>
      )}

      {modalOpen && <ProjectModal onSave={onAdd} onClose={onCloseModal} />}
      {editingProject && (
        <ProjectModal project={editingProject} onSave={onUpdate} onClose={() => setEditingProject(null)} />
      )}
      {viewer && <MediaViewer mode={viewer.mode} title={viewer.title} src={viewer.src} onClose={() => setViewer(null)} />}
    </section>
  );
}
