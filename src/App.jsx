import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Projects from './components/Projects';
import Profile from './components/Profile';
import ProfileModal from './components/ProfileModal';
import Welcome from './components/Welcome';
import { usePerfil, defaultPerfil } from './hooks/usePerfil';
import { useTrabajos } from './hooks/useTrabajos';
import { alertSuccess, alertError } from './lib/alert';

const SIDEBAR_STORAGE_KEY = 'josedev-sidebar-collapsed';
const THEME_STORAGE_KEY = 'portfolio_theme';

function loadSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function App() {
  const { perfil, loading: loadingPerfil, savePerfil } = usePerfil();
  const { trabajos, loading: loadingTrabajos, addTrabajo, updateTrabajo, deleteTrabajo } = useTrabajos();

  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(loadSidebarCollapsed);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === 'dark');
  const [accessMode, setAccessMode] = useState(null);
  const mainContentRef = useRef(null);
  const editMode = accessMode === 'admin';

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleNavigate = (link) => {
    if (link.action === 'add') {
      setModalOpen(true);
      return;
    }
    setActiveSection(link.id);
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProject = async (formData, archivoFile, portadaFile) => {
    try {
      await addTrabajo(formData, archivoFile, portadaFile);
      alertSuccess('¡Guardado!', 'Tu trabajo fue agregado al portafolio.');
    } catch {
      alertError();
      throw new Error('add-trabajo-failed');
    }
  };

  const handleUpdateProject = async (formData, archivoFile, portadaFile, id) => {
    try {
      await updateTrabajo(id, formData, archivoFile, portadaFile);
      alertSuccess('¡Actualizado!', 'Los cambios fueron guardados correctamente.');
    } catch {
      alertError();
      throw new Error('update-trabajo-failed');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteTrabajo(id);
      alertSuccess('¡Eliminado!', 'El trabajo fue eliminado correctamente.');
    } catch {
      alertError();
    }
  };

  const handleSaveProfile = async (formData, fotoFile) => {
    try {
      await savePerfil(formData, fotoFile);
      alertSuccess('¡Perfil actualizado!', 'Tus datos fueron guardados correctamente.');
    } catch {
      alertError();
      throw new Error('save-perfil-failed');
    }
  };

  if (accessMode === null) {
    return (
      <Welcome
        perfil={perfil ?? defaultPerfil}
        loading={loadingPerfil}
        onGuestAccess={() => setAccessMode('guest')}
        onAdminAccess={() => setAccessMode('admin')}
      />
    );
  }

  return (
    <div className={`layout${darkMode ? ' dark' : ''}`}>
      <Sidebar
        profile={perfil ?? defaultPerfil}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        editMode={editMode}
      />

      <div className="layout-main">
        <Header
          activeSection={activeSection}
          projectCount={trabajos.length}
          onAddWork={() => setModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((v) => !v)}
          editMode={editMode}
        />

        <main className="main-content" ref={mainContentRef}>
          {activeSection === 'perfil' ? (
            <Profile
              profile={perfil}
              loading={loadingPerfil}
              projects={trabajos}
              onEditProfile={() => setProfileModalOpen(true)}
              editMode={editMode}
            />
          ) : (
            <Projects
              projects={trabajos}
              loading={loadingTrabajos}
              profile={perfil ?? defaultPerfil}
              onAdd={handleAddProject}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              modalOpen={modalOpen}
              onCloseModal={() => setModalOpen(false)}
              editMode={editMode}
            />
          )}
        </main>
      </div>

      {profileModalOpen && perfil && (
        <ProfileModal profile={perfil} onSave={handleSaveProfile} onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
