import { useState } from 'react';
import type { FeaturesBlock } from '../../types/schema';
import styles from './Features.module.css';

export function Features({ data }: { data: FeaturesBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const itemsRaw = data.items || (data as any).features || [];
  const items = itemsRaw.map((item: any) => ({
    title: item.title || item.name || item.label || '',
    description: item.description || item.desc || item.content || ''
  }));

  return (
    <div className={styles.grid}>
      {items.map((item, idx) => {
        const isOpen = !!openStates[idx];
        return (
          <div 
            key={idx} 
            className={`${styles.card} ${isOpen ? styles.open : ''}`} 
            style={{ '--index': idx } as React.CSSProperties}
            onClick={() => setOpenStates(prev => ({ ...prev, [idx]: !prev[idx] }))}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <span className={styles.number}>{idx + 1}</span>
              </div>
              <h4 className={styles.title}>{item.title}</h4>
              <div className={styles.chevron}>{isOpen ? '▲' : '▼'}</div>
            </div>
            <div className={styles.descWrapper}>
              <p className={styles.desc} dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
