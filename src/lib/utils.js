import { supabase } from './supabase.js';

export const BUCKET = 'question-images';

export function timeAgo(date) {
  const s = (Date.now() - new Date(date).getTime()) / 1000;
  if (s < 60) return 'baru saja';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function imageUrl(path) {
  return path ? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : null;
}

export const authorName = (row) => row?.profiles?.display_name ?? 'Anonim';
export const initial = (name) => (name || '?').trim().charAt(0).toUpperCase();

const palette = ['#2E7D5B', '#E08A1E', '#D6456B', '#3B7DD8', '#8A5CC2', '#0E9AA7'];
export function avatarColor(name = '') {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997;
  return palette[h % palette.length];
}
