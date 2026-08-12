import { useState, useEffect } from 'react';

/**
 * Hook tải file qs.json của môn học (nằm cùng thư mục với kb.json)
 */
export function useQuestionBank(kbPath: string) {
  const [qsData, setQsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      // Ví dụ: kbPath = "/data/gdtc-1/kb.json" -> qsPath = "/data/gdtc-1/qs.json"
      const qsPath = kbPath.replace('kb.json', 'qs.json');
      
      try {
        setLoading(true);
        const response = await fetch(qsPath);
        if (!response.ok) {
          // File không tồn tại hoặc lỗi, ta im lặng chấp nhận (không có qs.json)
          if (!cancelled) setQsData([]);
          return;
        }

        const rawJson = await response.json();
        
        // Hỗ trợ dạng Object hoặc Array. Nếu Object có key "10" (chương) thì parse
        let parsedData: any[] = [];
        if (Array.isArray(rawJson)) {
          parsedData = rawJson;
        } else if (typeof rawJson === 'object' && rawJson !== null) {
          // Flatten dictionary: { "Chương 1": [{q,a}], "Chương 2": [{q,a}] }
          Object.entries(rawJson).forEach(([key, items]) => {
            if (Array.isArray(items)) {
              items.forEach(item => {
                // Thêm key (tên chương) vào làm một tag phụ
                const currentTags = item.tags || [];
                parsedData.push({
                  ...item,
                  tags: [...currentTags, key]
                });
              });
            }
          });
        }
        
        if (!cancelled) {
          setQsData(parsedData);
        }
      } catch (err) {
        if (!cancelled) {
          setQsData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => { cancelled = true; };
  }, [kbPath]);

  return { qsData, loading };
}
