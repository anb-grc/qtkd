import { useState, type ReactNode } from 'react';
import styles from './BlockWrapper.module.css';

interface BlockWrapperProps {
  title: string;
  id?: string;
  children: ReactNode;
  className?: string;
  index?: number;
}

/**
 * BlockWrapper — Card chung bọc ngoài mọi block component.
 * Cung cấp: số thứ tự tự nhiên (hoặc thanh accent), tiêu đề, nút thu gọn/mở rộng, viền card glassmorphism.
 */
export function BlockWrapper({ title, id, children, className = '' }: BlockWrapperProps) {
  const [isLearned, setIsLearned] = useState(() => {
    if (!id) return false;
    return localStorage.getItem(`learned_${id}`) === 'true';
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleLearned = () => {
    if (!id) return;
    const newState = !isLearned;
    setIsLearned(newState);
    if (newState) {
      localStorage.setItem(`learned_${id}`, 'true');
    } else {
      localStorage.removeItem(`learned_${id}`);
    }
  };

  return (
    <div className={`${styles.block} ${className} ${isLearned ? styles.learned : ''} ${isCollapsed ? styles.collapsedBlock : ''}`}>
      <div 
        className={styles.blockHeader}
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.blockTitle} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <div className={styles.blockActions}>
          {id && (
            <button 
              className={`${styles.learnedBtn} ${isLearned ? styles.active : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLearned();
              }}
              title={isLearned ? "Bỏ đánh dấu Đã thuộc" : "Đánh dấu Đã thuộc"}
            >
              {isLearned ? '✓ Đã thuộc' : 'Đánh dấu'}
            </button>
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div className={styles.blockContent}>
          {children}
        </div>
      )}
    </div>
  );
}
