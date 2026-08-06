import { useState } from 'react';
import type { CarouselBlock } from '../../types/schema';
import styles from './Carousel.module.css';

export function Carousel({ data }: { data: CarouselBlock['data'] }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const itemsRaw = data.items || (data as any).slides || [];
  const items = itemsRaw.map((item: any) => ({
    title: item.title || item.name || item.label || '',
    description: item.description || item.desc || item.content || ''
  }));

  return (
    <div className={styles.container}>
      <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
        {items.map((item, i) => (
          <div key={i} className={styles.slide}>
            <div 
              className={`${styles.card} ${open ? styles.open : ''}`}
              onClick={() => {
                if (i === current) setOpen(!open);
              }}
            >
              <h3>{item.title}</h3>
              {item.description && <div className={styles.chevron}>{open ? '▲' : '▼'}</div>}
              {item.description && (
                <div className={styles.descWrapper}>
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button onClick={() => {setCurrent(p => Math.max(0, p-1)); setOpen(false);}} disabled={current === 0}>&larr;</button>
        <div className={styles.dots}>
          {items.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === current ? styles.activeDot : ''}`} onClick={() => {setCurrent(i); setOpen(false);}} />
          ))}
        </div>
        <button onClick={() => {setCurrent(p => Math.min(items.length - 1, p+1)); setOpen(false);}} disabled={current === items.length - 1}>&rarr;</button>
      </div>
    </div>
  );
}
