import { supabase } from './supabase';

export async function uploadFile(bucket, folder, file) {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function deleteFile(bucket, url) {
  if (!url) return;
  const path = url.split(`${bucket}/`)[1];
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error(`No se pudo eliminar el archivo del storage: ${path}`, error);
}
