import { useState, useEffect } from 'react';

const API_KEY            = import.meta.env.VITE_GDRIVE_API_KEY;
const DEFAULT_FOLDER_ID  = import.meta.env.VITE_GDRIVE_FOLDER_ID;

export function useGoogleDrivePhotos(folderId) {
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const targetFolder = folderId || DEFAULT_FOLDER_ID;

  useEffect(() => {
    if (!API_KEY || !targetFolder || API_KEY === 'YOUR_API_KEY_HERE') {
      setLoading(false);
      return;
    }

    const q = encodeURIComponent(`'${targetFolder}' in parents and mimeType contains 'image/' and trashed = false`);

    async function fetchAll() {
      let all = [];
      let pageToken = null;
      do {
        const tokenParam = pageToken ? `&pageToken=${pageToken}` : '';
        const url = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${API_KEY}&fields=nextPageToken,files(id,name)&pageSize=1000${tokenParam}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error(`Drive API error: ${r.status}`);
        const data = await r.json();
        all = all.concat(data.files || []);
        pageToken = data.nextPageToken || null;
      } while (pageToken);
      return all;
    }

    fetchAll()
      .then(files => {
        const imgs = files.map(f => ({
          id:  f.id,
          alt: f.name,
          src: `https://drive.google.com/thumbnail?id=${f.id}&sz=w800`,
        }));
        setPhotos(imgs);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [targetFolder]);

  return { photos, loading, error };
}
