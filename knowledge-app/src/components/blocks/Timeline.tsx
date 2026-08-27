import { useState } from 'react';
import type { TimelineBlock } from '../../types/schema';
import styles from './Timeline.module.css';

export function Timeline({ data }: { data: TimelineBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const itemsRaw = data.items || (data as any).events || [];
  const items = itemsRaw.map((item: any) => ({
    time: item.time || item.title || item.name || '',
    content: item.content || item.description || item.desc || ''
  }));

  return (
    <div className={styles.timeline}>
      {items.map((item, idx) => {
        const isOpen = !!openStates[idx];
        return (
          <div 
            key={idx} 
            className={`${styles.item} ${isOpen ? styles.open : ''}`} 
            style={{ '--delay': `${idx * 0.1}s` } as React.CSSProperties}
            onClick={() => setOpenStates(prev => ({ ...prev, [idx]: !prev[idx] }))}
          >
            <div className={styles.marker}>
              <div className={styles.markerInner}></div>
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.chevron}>{isOpen ? '▲' : '▼'}</div>
              </div>
              <div className={styles.descWrapper}>
                <div className={styles.desc} dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
