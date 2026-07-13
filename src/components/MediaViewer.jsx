import { X, ImageOff } from 'lucide-react';

export default function MediaViewer({ mode, title, src, onClose }) {
  const showNoImage = mode === 'image' && !src;

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className={`viewer-card${mode === 'image' ? ' viewer-card-image' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h3>{title}</h3>
          <button type="button" className="viewer-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="viewer-body">
          {mode === 'powerbi' ? (
            <iframe src={src} title={title} width="100%" height="500" frameBorder="0" allowFullScreen />
          ) : showNoImage ? (
            <div className="viewer-no-image">
              <ImageOff size={48} strokeWidth={1.75} color="#185FA5" />
              <p>Sin imagen de portada</p>
            </div>
          ) : (
            <img src={src} alt={title} />
          )}
        </div>
      </div>
    </div>
  );
}
