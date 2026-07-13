import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadFile, deleteFile } from '../lib/storage';

export const defaultPerfil = {
  nombre: 'Jose Chipana',
  carrera: 'Ingeniería de Sistemas',
  semestre: '7mo semestre',
  universidad: 'Universidad Nacional de Cañete',
  ciudad: 'San Vicente de Cañete, Perú',
  disponibilidad: 'Disponible',
  descripcion:
    'Estudiante de Ingeniería de Sistemas apasionado por el desarrollo full-stack, redes y machine learning.',
  github: '',
  linkedin: '',
  email: '',
  skills: ['Laravel', 'React', 'YOLOv8', 'FastAPI', 'Cisco', 'Power BI', 'Docker', 'Python'],
  foto_url: null,
};

export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  async function fetchPerfil() {
    setLoading(true);
    const { data } = await supabase.from('perfil').select('*').limit(1).maybeSingle();
    setPerfil(data ?? defaultPerfil);
    setLoading(false);
  }

  async function savePerfil(nuevoPerfil, fotoFile) {
    let foto_url = nuevoPerfil.foto_url;

    if (fotoFile) {
      if (perfil?.foto_url) await deleteFile('portafolio', perfil.foto_url);
      foto_url = await uploadFile('portafolio', 'fotos-perfil', fotoFile);
    }

    const perfilData = { ...nuevoPerfil, foto_url };

    if (perfil?.id) {
      const { data, error } = await supabase
        .from('perfil')
        .update(perfilData)
        .eq('id', perfil.id)
        .select()
        .single();
      if (error) throw error;
      setPerfil(data);
      return data;
    }

    const { data, error } = await supabase.from('perfil').insert(perfilData).select().single();
    if (error) throw error;
    setPerfil(data);
    return data;
  }

  return { perfil, loading, savePerfil, fetchPerfil };
}
