import { useState } from 'react';
import type { QuadrantBlock } from '../../types/schema';
import styles from './Quadrant.module.css';

export function Quadrant({ data }: { data: QuadrantBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  let quads: { title: string; content: string }[] = [];
  if (data.quadrants && Array.isArray(data.quadrants)) {
    quads = data.quadrants.map((q: any) => ({
      title: q.title || q.name || q.label || '',
      content: q.content || q.description || q.desc || (Array.isArray(q.items) ? q.items.join('<br/>') : '')
    }));
  } else if ((data as any).q1_title !== undefined) {
    quads = [1, 2, 3, 4].map(i => ({
      title: (data as any)[`q${i}_title`] || '',
      content: (data as any)[`q${i}_content`] || ''
    }));
  } else if ((data as any).topLeft !== undefined) {
    const keys = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    quads = keys.map(k => ({
      title: (data as any)[k]?.title || (data as any)[k]?.name || '',
      content: (data as any)[k]?.description || (data as any)[k]?.content || ''
    }));
  }
  while (quads.length < 4) quads.push({ title: 'Góc', content: '' });

  const xAxis = data.x_axis || (data as any).xAxis || '';
  const yAxis = data.y_axis || (data as any).yAxis || '';

  return (
    <div className={styles.container}>
      {yAxis && <div className={styles.yAxis}>{yAxis}</div>}
      
      <div className={styles.grid}>
        {quads.map((quad, i) => {
          const isActive = !!openStates[i];
          return (
            <div 
              key={i} 
              className={`${styles.quadrant} ${isActive ? styles.expanded : ''}`}
              onClick={() => setOpenStates(prev => ({ ...prev, [i]: !prev[i] }))}
            >
              <div className={styles.qHeader}>
                <h4 className={styles.title}>{quad.title}</h4>
                <div className={styles.clickHint}>{isActive ? '▲' : '▼'}</div>
              </div>
              <div className={styles.contentWrapper}>
                <p className={styles.content} dangerouslySetInnerHTML={{ __html: quad.content }} />
              </div>
            </div>
          );
        })}
      </div>
      
      {xAxis && <div className={styles.xAxis}>{xAxis}</div>}
    </div>
  );
}
