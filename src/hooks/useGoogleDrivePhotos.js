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
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=files(id,name,thumbnailLink)&pageSize=50`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Drive API error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('Drive API response:', data.files);
        const imgs = (data.files || [])
          .filter(f => f.thumbnailLink)
          .map(f => ({
            id:  f.id,
            alt: f.name,
            src: f.thumbnailLink.replace('=s220', '=s800'),
          }));
        console.log('Photos to render:', imgs);
        setPhotos(imgs);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { photos, loading, error };
}
