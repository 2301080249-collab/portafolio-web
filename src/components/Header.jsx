import { Plus, Sun, Moon } from 'lucide-react';

const SECTION_TITLES = {
  inicio: 'Mis trabajos',
  perfil: 'Mi perfil',
};

export default function Header({ activeSection, projectCount, onAddWork, darkMode, onToggleDarkMode, editMode }) {
  const title = SECTION_TITLES[activeSection] ?? activeSection;
  const isInicio = activeSection === 'inicio';

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-title">{title}</span>
        {isInicio && <span className="app-header-badge">{projectCount}</span>}
      </div>

      <div className="app-header-right">
        <button
          type="button"
          className="app-header-theme-toggle"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? <Sun size={16} strokeWidth={2} color="#EF9F27" /> : <Moon size={16} strokeWidth={2} color="#185FA5" />}
        </button>

        {isInicio && editMode && (
          <button type="button" className="app-header-add-btn" onClick={onAddWork}>
            <Plus size={15} strokeWidth={2} />
            Agregar trabajo
          </button>
        )}
      </div>
    </header>
  );
}
