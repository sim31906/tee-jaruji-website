import { useState, useEffect } from 'react';

const GALLERY_WORKER = 'https://tee-gallery.sim31906.workers.dev';

export function useR2Videos(folder = 'pr') {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${GALLERY_WORKER}?folder=${encodeURIComponent(folder)}`)
      .then(r => r.json())
      .then(data => {
        const items = (Array.isArray(data) ? data : [])
          .filter(v => /\.(mp4|mov|webm)$/i.test(v.key))
          .map((v, i) => ({
            id:   `r2v-${i}`,
            type: 'video',
            src:  v.url,
            alt:  v.name,
          }));
        setVideos(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [folder]);

  return { videos, loading };
}
