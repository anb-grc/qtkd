import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Thử lấy container của quiz.html, nếu không có thì fallback về root (chạy dev độc lập)
const container = document.getElementById('knowledge-content') || document.getElementById('root');

// Lấy biến toàn cục KB_DATA_URL từ quiz.html, hoặc dùng mock data
const dataPath = (window as any).KB_DATA_URL || "/data/mac-lenin/kb.json";

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App dataPath={dataPath} />
    </StrictMode>,
  );
}
