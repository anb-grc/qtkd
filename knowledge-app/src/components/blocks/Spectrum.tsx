import { useState } from 'react';
import type { SpectrumBlock } from '../../types/schema';
import styles from './Spectrum.module.css';

export function Spectrum({ data }: { data: SpectrumBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const itemsRaw = data.items || (data as any).points || [];
  const items = itemsRaw.map((item: any) => ({
    title: item.title || item.name || item.label || '',
    description: item.description || item.desc || item.content || ''
  }));

  return (
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.points}>
        {items.map((item, i) => {
          const isOpen = !!openStates[i];
          return (
            <div 
              key={i} 
              className={`${styles.point} ${isOpen ? styles.open : ''}`}
              onClick={() => setOpenStates(prev => ({ ...prev, [i]: !prev[i] }))}
            >
              <div className={styles.marker}></div>
              <div className={styles.content}>
                <div className={styles.header}>
                  <h4>{item.title}</h4>
                  
                </div>
                {item.description && (
                  <div className={styles.descWrapper}>
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
