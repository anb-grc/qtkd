import { useState } from 'react';
import type { FeaturesBlock } from '../../types/schema';
import styles from './Features.module.css';

export function Features({ data }: { data: FeaturesBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const itemsRaw = data.items || (data as any).features || [];
  const items = itemsRaw.map((item: any) => ({
    title: (item.title || item.name || item.label || '').replace(/^(Bước\s+)?\d+[\.\-\)]?\s*/i, ''),
    description: item.description || item.desc || item.content || '',
    points: item.points
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
              
            </div>
            <div className={styles.descWrapper}>
              <p className={styles.desc} dangerouslySetInnerHTML={{ __html: item.description }} />
              {Array.isArray((item as any).points) && (item as any).points.length > 0 && (
                <ul className="kb-points-list">
                  {(item as any).points.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
