import { useState, useEffect } from 'react';

const API_KEY   = import.meta.env.VITE_GDRIVE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;
const CACHE_KEY = 'gdrive_photos_cache';

export function useGoogleDrivePhotos() {
  const cached = (() => { try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null'); } catch { return null; } })();
  const [photos, setPhotos]   = useState(cached || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (cached) return; // already have data, skip fetch
    if (!API_KEY || !FOLDER_ID || API_KEY === 'YOUR_API_KEY_HERE') {
      setLoading(false);
      return;
    }

    const q = encodeURIComponent(`'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=files(id,name,thumbnailLink)&pageSize=50`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Drive API error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        const imgs = (data.files || [])
          .filter(f => f.thumbnailLink)
          .map(f => ({
            id:  f.id,
            alt: f.name,
            src: f.thumbnailLink.replace('=s220', '=s800'),
          }));
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(imgs)); } catch {}
        setPhotos(imgs);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { photos, loading, error };
}
