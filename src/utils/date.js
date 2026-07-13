const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_FULL = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function currentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

export function formatMonthYear(value, full = false) {
  if (!value) return '';
  const [year, month] = value.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) return value;
  const name = full ? MONTHS_FULL[month - 1] : MONTHS_SHORT[month - 1];
  return `${name} ${year}`;
}
