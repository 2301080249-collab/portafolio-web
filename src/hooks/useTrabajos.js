import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadFile, deleteFile } from '../lib/storage';

function detectFormato(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (['doc', 'docx'].includes(ext)) return 'Word';
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'Imagen';
  if (ext === 'pbix') return 'Power BI';
  return null;
}

export function useTrabajos() {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrabajos();
  }, []);

  async function fetchTrabajos() {
    setLoading(true);
    const { data } = await supabase.from('trabajos').select('*').order('created_at', { ascending: false });
    setTrabajos(data || []);
    setLoading(false);
  }

  async function addTrabajo(formData, archivoFile, portadaFile) {
    let archivo_url = null;
    let portada_url = null;
    let formato_archivo = null;

    if (archivoFile) {
      archivo_url = await uploadFile('portafolio', 'archivos', archivoFile);
      formato_archivo = detectFormato(archivoFile.name);
    }

    if (portadaFile) {
      portada_url = await uploadFile('portafolio', 'portadas', portadaFile);
    }

    const { data, error } = await supabase
      .from('trabajos')
      .insert({
        titulo: formData.titulo,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        fecha: formData.fecha ? `${formData.fecha}-01` : null,
        link_externo: formData.linkExterno || null,
        archivo_url,
        portada_url,
        formato_archivo,
      })
      .select()
      .single();

    if (error) throw error;

    setTrabajos((prev) => [data, ...prev]);
    return data;
  }

  async function updateTrabajo(id, formData, archivoFile, portadaFile) {
    const current = trabajos.find((t) => t.id === id);

    let archivo_url = current?.archivo_url ?? null;
    let formato_archivo = current?.formato_archivo ?? null;
    if (archivoFile) {
      archivo_url = await uploadFile('portafolio', 'archivos', archivoFile);
      formato_archivo = detectFormato(archivoFile.name);
      if (current?.archivo_url) await deleteFile('portafolio', current.archivo_url);
    }

    let portada_url = current?.portada_url ?? null;
    if (portadaFile) {
      portada_url = await uploadFile('portafolio', 'portadas', portadaFile);
      if (current?.portada_url) await deleteFile('portafolio', current.portada_url);
    }

    const { data, error } = await supabase
      .from('trabajos')
      .update({
        titulo: formData.titulo,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        fecha: formData.fecha ? `${formData.fecha}-01` : null,
        link_externo: formData.linkExterno || null,
        archivo_url,
        portada_url,
        formato_archivo,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setTrabajos((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  }

  async function deleteTrabajo(id) {
    const trabajo = trabajos.find((t) => t.id === id);

    const { error } = await supabase.from('trabajos').delete().eq('id', id);
    if (error) throw error;

    if (trabajo?.archivo_url) await deleteFile('portafolio', trabajo.archivo_url);
    if (trabajo?.portada_url) await deleteFile('portafolio', trabajo.portada_url);

    setTrabajos((prev) => prev.filter((t) => t.id !== id));
  }

  return { trabajos, loading, addTrabajo, updateTrabajo, deleteTrabajo, fetchTrabajos };
}
