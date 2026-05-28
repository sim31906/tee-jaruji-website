import { useState, useEffect } from 'react';

const API_KEY   = import.meta.env.VITE_GDRIVE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;

export function useGoogleDrivePhotos() {
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!API_KEY || !FOLDER_ID || API_KEY === 'YOUR_API_KEY_HERE') {
      setLoading(false);
      return;
    }

    const q = encodeURIComponent(`'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=files(id,name)&pageSize=100`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Drive API error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        const imgs = (data.files || []).map(f => ({
          id:  f.id,
          alt: f.name,
          src: `https://drive.google.com/thumbnail?id=${f.id}&sz=w800`,
        }));
        setPhotos(imgs);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { photos, loading, error };
}
