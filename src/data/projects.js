export const navLinks = [
  { id: 'inicio', label: 'Mis trabajos', icon: 'LayoutGrid' },
  { id: 'perfil', label: 'Mi perfil', icon: 'User' },
  { id: 'agregar', label: 'Agregar trabajo', icon: 'Plus', action: 'add' },
];

export const workTypes = [
  { id: 'documento', label: 'Documento de proyecto', icon: 'FileText', bg: '#E6F1FB', text: '#0C447C' },
  { id: 'articulo', label: 'Artículo de investigación', icon: 'BookOpen', bg: '#EEEDFE', text: '#3C3489' },
  { id: 'powerbi', label: 'Dashboard Power BI', icon: 'BarChart3', bg: '#FAEEDA', text: '#633806' },
  { id: 'dashboard', label: 'Dashboard / Visualización', icon: 'LayoutDashboard', bg: '#E1F5EE', text: '#085041' },
  { id: 'logro', label: 'Logro / Certificado', icon: 'Award', bg: '#FBEAF0', text: '#72243E' },
  { id: 'otro', label: 'Otro', icon: 'Paperclip', bg: '#EEF1F4', text: '#33475B' },
];

export const seedProjects = [
  {
    id: 'informe-wan-cetpro',
    title: 'Informe técnico: Diseño WAN CEBA/CETPRO',
    type: 'documento',
    description: 'Documentación de la red Hub-and-Spoke dual-stack IPv4/IPv6 con OSPFv2/v3 en Packet Tracer.',
    date: '2025-05',
    coverImage: null,
    fileData: null,
    fileType: null,
    embedUrl: '',
    externalLink: '#',
  },
  {
    id: 'dashboard-academico',
    title: 'Dashboard de indicadores académicos',
    type: 'powerbi',
    description: 'Reporte interactivo con KPIs, visualizaciones y análisis de datos académicos.',
    date: '2025-08',
    coverImage: null,
    fileData: null,
    fileType: null,
    embedUrl: '#',
    externalLink: '',
  },
  {
    id: 'certificacion-powerbi',
    title: 'Certificación Power BI — Microsoft',
    type: 'logro',
    description: 'Curso completado sobre modelado de datos, DAX y visualización con Power BI.',
    date: '2025-03',
    coverImage: null,
    fileData: null,
    fileType: null,
    embedUrl: '',
    externalLink: '',
  },
];
