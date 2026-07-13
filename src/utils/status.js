export const STATUS_OPTIONS = [
  { id: 'Disponible', label: 'Disponible', color: '#1D9E75', textColor: '#5DCAA5' },
  { id: 'Buscando prácticas', label: 'Buscando prácticas', color: '#378ADD', textColor: '#85B7EB' },
  { id: 'En tesis', label: 'En tesis', color: '#EF9F27', textColor: '#F3C481' },
  { id: 'Ocupado', label: 'Ocupado', color: '#888780', textColor: '#B7B6B0' },
];

export function getStatusMeta(status) {
  return STATUS_OPTIONS.find((s) => s.id === status) ?? STATUS_OPTIONS[0];
}
