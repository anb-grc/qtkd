import { useState, useEffect } from 'react';
import type { KnowledgeBase } from '../types/schema';

interface UseKnowledgeBaseResult {
  data: KnowledgeBase | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook — Fetch và parse file kb.json.
 * Trả về { data, loading, error } cho component sử dụng.
 */
export function useKnowledgeBase(jsonPath: string): UseKnowledgeBaseResult {
  const [data, setData] = useState<KnowledgeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`Không tải được dữ liệu: ${response.status}`);
        }

        const rawJson = await response.json();
        const json: KnowledgeBase = Array.isArray(rawJson)
          ? { 
              subject: 'Kinh tế chính trị Mác - Lênin', 
              overview: { type: 'mindmap', title: '', data: { root: '', children: [] } },
              details: []
            }
          : rawJson;

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Cleanup: tránh set state sau khi component unmount
    return () => { cancelled = true; };
  }, [jsonPath]);

  return { data, loading, error };
}
