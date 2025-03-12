import { useState, useEffect } from 'react';
import { fetchAboutMeData, NotionDataByType } from '../data/lifeApi';

export function useAboutMeData() {
  const [notionData, setAboutMeData] = useState<NotionDataByType>({
    books_collection: [],
    videos_collection: [],
    podcasts_collection: [],
    people_collection: [],
    blogs_collection: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAboutMeData();
        setAboutMeData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error loading Notion data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { notionData, loading, error };
}