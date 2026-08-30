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
      // Ưu tiên dùng QS_DATA_URL do quiz.html truyền vào (để khớp tên file ngân hàng đề như Ngan_hang_de_xxx.json)
      let qsPath = (window as any).QS_DATA_URL;
      if (!qsPath) {
        qsPath = kbPath.replace('kb.json', 'qs.json');
      }
      
      try {
        setLoading(true);
        // Thêm cache buster
        const fetchUrl = qsPath.includes('?') ? qsPath : `${qsPath}?v=${new Date().getTime()}`;
        const response = await fetch(fetchUrl);
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
