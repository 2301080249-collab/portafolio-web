import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  X,
  FileText,
  Microscope,
  PieChart,
  LayoutDashboard,
  Award,
  MoreHorizontal,
  CloudUpload,
  CheckCircle2,
  Check,
  Loader2,
} from 'lucide-react';
import { workTypes } from '../data/projects';
import { currentMonthValue } from '../utils/date';

const DESCRIPTION_MAX = 120;
const COVER_FIELD_TYPES = ['documento', 'articulo', 'powerbi'];

const TYPE_ICONS = {
  documento: FileText,
  articulo: Microscope,
  powerbi: PieChart,
  dashboard: LayoutDashboard,
  logro: Award,
  otro: MoreHorizontal,
};

const emptyForm = {
  titulo: '',
  tipo: workTypes[0].id,
  archivoFile: null,
  portadaFile: null,
  portadaPreviewUrl: null,
  linkExterno: '',
  fecha: currentMonthValue(),
  descripcion: '',
};

function formFromProject(project) {
  return {
    titulo: project.titulo,
    tipo: project.tipo,
    archivoFile: null,
    portadaFile: null,
    portadaPreviewUrl: project.portada_url || null,
    linkExterno: project.link_externo || '',
    fecha: project.fecha ? project.fecha.slice(0, 7) : currentMonthValue(),
    descripcion: project.descripcion || '',
  };
}

function UploadZone({ accept, compact, onSelect, fileName, previewSrc, mainText, subText, hasError }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      className={`upload-zone${compact ? ' upload-zone-compact' : ''}${dragOver ? ' drag-over' : ''}${
        hasError ? ' has-error' : ''
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="upload-zone-input"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {previewSrc ? (
        <img className="upload-zone-preview" src={previewSrc} alt="" />
      ) : fileName ? (
        <div className="upload-zone-filled">
          <CheckCircle2 size={18} strokeWidth={2} />
          <span>{fileName}</span>
        </div>
      ) : (
        <>
          <CloudUpload size={24} strokeWidth={1.75} />
          <p className="upload-zone-text">{mainText}</p>
          <p className="upload-zone-subtext">{subText}</p>
        </>
      )}
    </div>
  );
}

function CurrentFileHint({ existingArchivo, hasNewFile }) {
  if (!existingArchivo || hasNewFile) return null;
  return (
    <p className="current-file-hint">
      Archivo actual: {existingArchivo.formato || 'archivo'} · Sube uno nuevo para reemplazarlo
    </p>
  );
}

function TypeFields({ form, update, onArchivoFile, hasError, existingArchivo }) {
  switch (form.tipo) {
    case 'documento':
    case 'articulo':
      return (
        <div className="field">
          <label>Archivo (PDF o Word)</label>
          <UploadZone
            accept=".pdf,.doc,.docx"
            onSelect={onArchivoFile}
            fileName={form.archivoFile?.name}
            mainText="Arrastra el archivo aquí"
            subText="PDF o Word · máx. 10 MB"
            hasError={hasError}
          />
          <CurrentFileHint existingArchivo={existingArchivo} hasNewFile={Boolean(form.archivoFile)} />
        </div>
      );
    case 'powerbi':
      return (
        <>
          <div className="field">
            <label>Archivo .pbix</label>
            <UploadZone
              accept=".pbix"
              onSelect={onArchivoFile}
              fileName={form.archivoFile?.name}
              mainText="Arrastra el archivo .pbix aquí"
              subText="Power BI Desktop · máx. 10 MB"
              hasError={hasError}
            />
            <CurrentFileHint existingArchivo={existingArchivo} hasNewFile={Boolean(form.archivoFile)} />
          </div>

          <p className="field-separator">o</p>

          <div className="field">
            <label>Embed URL</label>
            <input
              type="url"
              className={hasError ? 'has-error' : ''}
              value={form.linkExterno}
              onChange={update('linkExterno')}
              placeholder="https://app.powerbi.com/view?r=..."
            />
          </div>

          <p className="field-note">
            Sube el .pbix para descarga directa, o pega un link embed para verlo en el navegador.
          </p>
        </>
      );
    case 'dashboard':
    case 'logro':
      return (
        <div className="field">
          <label>Imagen</label>
          <UploadZone
            accept="image/*"
            onSelect={onArchivoFile}
            fileName={form.archivoFile?.name}
            mainText="Arrastra la imagen aquí"
            subText="o haz clic para seleccionar · máx. 10 MB"
            hasError={hasError}
          />
          <CurrentFileHint existingArchivo={existingArchivo} hasNewFile={Boolean(form.archivoFile)} />
        </div>
      );
    default:
      return (
        <div className="field">
          <label>Archivo</label>
          <UploadZone
            accept=".pdf,.doc,.docx,image/*"
            onSelect={onArchivoFile}
            fileName={form.archivoFile?.name}
            mainText="Arrastra el archivo aquí"
            subText="PDF, Word o imagen · máx. 10 MB"
            hasError={hasError}
          />
          <CurrentFileHint existingArchivo={existingArchivo} hasNewFile={Boolean(form.archivoFile)} />
        </div>
      );
  }
}

export default function ProjectModal({ project, onSave, onClose }) {
  const isEditMode = Boolean(project);
  const [form, setForm] = useState(() => (isEditMode ? formFromProject(project) : emptyForm));
  const [errors, setErrors] = useState({ titulo: false, contenido: false });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    return () => {
      if (form.portadaPreviewUrl) URL.revokeObjectURL(form.portadaPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTipo = (tipoId) => {
    setForm((prev) => ({ ...prev, tipo: tipoId, archivoFile: null, linkExterno: '' }));
    setErrors((prev) => ({ ...prev, contenido: false }));
  };

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'titulo') setErrors((prev) => ({ ...prev, titulo: false }));
  };

  const handleDescriptionChange = (e) => {
    setForm((prev) => ({ ...prev, descripcion: e.target.value.slice(0, DESCRIPTION_MAX) }));
  };

  const handleArchivoFile = (file) => {
    setForm((prev) => ({ ...prev, archivoFile: file }));
    setErrors((prev) => ({ ...prev, contenido: false }));
  };

  const handlePortadaFile = (file) => {
    setForm((prev) => {
      if (prev.portadaPreviewUrl) URL.revokeObjectURL(prev.portadaPreviewUrl);
      return { ...prev, portadaFile: file, portadaPreviewUrl: URL.createObjectURL(file) };
    });
  };

  const isPdfType = form.tipo === 'documento' || form.tipo === 'articulo';
  const isPowerbiType = form.tipo === 'powerbi';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tituloError = !form.titulo.trim();
    let contenidoError = false;
    if (isPdfType) contenidoError = !form.archivoFile && !form.linkExterno.trim();
    else if (isPowerbiType) contenidoError = !form.archivoFile && !form.linkExterno.trim();
    else contenidoError = !form.archivoFile && !form.portadaFile && !form.linkExterno.trim();

    if (tituloError || contenidoError) {
      setErrors({ titulo: tituloError, contenido: contenidoError });
      return;
    }

    setSaving(true);
    setSubmitError('');
    try {
      const payload = {
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        descripcion: form.descripcion,
        fecha: form.fecha,
        linkExterno: form.linkExterno.trim(),
      };
      if (isEditMode) {
        await onSave(payload, form.archivoFile, form.portadaFile, project.id);
      } else {
        await onSave(payload, form.archivoFile, form.portadaFile);
      }
      onClose();
    } catch {
      setSubmitError('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const showCoverField = COVER_FIELD_TYPES.includes(form.tipo);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-title">
            {isEditMode ? <Check size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
            {isEditMode ? 'Editar trabajo' : 'Agregar trabajo'}
          </span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-type-section">
          <p className="modal-type-label">¿Qué tipo de trabajo es?</p>
          <div className="type-grid">
            {workTypes.map((t) => {
              const Icon = TYPE_ICONS[t.id] ?? MoreHorizontal;
              return (
                <button
                  type="button"
                  key={t.id}
                  className={`type-card${form.tipo === t.id ? ' active' : ''}`}
                  onClick={() => selectTipo(t.id)}
                >
                  <Icon size={24} strokeWidth={1.75} className="type-card-icon" />
                  <span className="type-card-label">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="modal-divider" />

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre del trabajo</label>
            <input
              type="text"
              className={errors.titulo ? 'has-error' : ''}
              value={form.titulo}
              onChange={update('titulo')}
              placeholder="ej: Informe final INCIDEX"
            />
          </div>

          <div className="type-fields" key={form.tipo}>
            <TypeFields
              form={form}
              update={update}
              onArchivoFile={handleArchivoFile}
              hasError={errors.contenido}
              existingArchivo={
                isEditMode && project.archivo_url ? { formato: project.formato_archivo } : null
              }
            />
          </div>

          {showCoverField && (
            <div className="field">
              <label>
                Imagen de portada <span className="field-optional">(opcional)</span>
              </label>
              <UploadZone
                compact
                accept="image/*"
                onSelect={handlePortadaFile}
                previewSrc={form.portadaPreviewUrl}
                mainText="Portada del trabajo"
                subText="JPG, PNG · aparecerá en la card"
              />
            </div>
          )}

          {!isPowerbiType && (
            <div className="field">
              <label>
                Link externo <span className="field-optional">(opcional)</span>
              </label>
              <input
                type="url"
                value={form.linkExterno}
                onChange={update('linkExterno')}
                placeholder="https://..."
              />
            </div>
          )}

          <div className="field">
            <label>Fecha</label>
            <input type="month" value={form.fecha} onChange={update('fecha')} />
          </div>

          {errors.contenido && <p className="modal-error">Agrega un archivo o un link para este trabajo.</p>}

          <div className="field">
            <label>Descripción breve</label>
            <textarea
              rows={3}
              maxLength={DESCRIPTION_MAX}
              value={form.descripcion}
              onChange={handleDescriptionChange}
              placeholder="Describe brevemente este trabajo..."
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
                  Subiendo...
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  {isEditMode ? 'Guardar cambios' : 'Guardar trabajo'}
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
