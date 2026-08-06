import { useState } from 'react';
import type { FlipCardBlock } from '../../types/schema';
import styles from './FlipCard.module.css';

export function FlipCard({ data }: { data: FlipCardBlock['data'] }) {
  const [flipped, setFlipped] = useState(false);

  let frontText = data.front || '';
  let backText = data.back || '';
  if ((data as any).cards && Array.isArray((data as any).cards) && (data as any).cards.length > 0) {
    frontText = (data as any).cards[0].front || '';
    backText = (data as any).cards[0].back || '';
  }

  return (
    <div className={styles.perspective}>
      <div 
        className={`${styles.card} ${flipped ? styles.flipped : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`${styles.face} ${styles.front}`}>
          <div className={styles.decorCircle}></div>
          <div className={styles.label}>Câu hỏi</div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: frontText }} />
          <div className={styles.hint}>
            <span>Nhấn để lật</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
          </div>
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.decorCircle}></div>
          <div className={styles.label}>Đáp án</div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: backText }} />
          <div className={styles.hint}>Nhấn để quay lại</div>
        </div>
      </div>
    </div>
  );
}
