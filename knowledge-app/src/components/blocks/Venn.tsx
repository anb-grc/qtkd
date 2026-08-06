import { useState } from 'react';
import type { VennBlock } from '../../types/schema';
import styles from './Venn.module.css';

export function Venn({ data }: { data: VennBlock['data'] }) {
  const [hoveredZone, setHoveredZone] = useState<'left' | 'right' | 'intersection' | null>(null);

  let leftTitle = data.left?.title || '';
  let leftItems: string[] = data.left?.items || ((data.left as any)?.desc ? [(data.left as any).desc] : []);
  let rightTitle = data.right?.title || '';
  let rightItems: string[] = data.right?.items || ((data.right as any)?.desc ? [(data.right as any).desc] : []);
  let intersectionText = data.intersection || '';

  if ((data as any).sets && Array.isArray((data as any).sets) && (data as any).sets.length >= 2) {
    leftTitle = (data as any).sets[0].name || (data as any).sets[0].title || '';
    leftItems = (data as any).sets[0].items || ((data as any).sets[0].desc ? [(data as any).sets[0].desc] : []);
    rightTitle = (data as any).sets[1].name || (data as any).sets[1].title || '';
    rightItems = (data as any).sets[1].items || ((data as any).sets[1].desc ? [(data as any).sets[1].desc] : []);
    if ((data as any).intersections && Array.isArray((data as any).intersections) && (data as any).intersections.length > 0) {
      intersectionText = (data as any).intersections[0].desc || (data as any).intersections[0].description || '';
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.vennArea}>
        
        {/* Left Circle */}
        <div 
          className={`${styles.circle} ${styles.left} ${hoveredZone === 'left' ? styles.active : ''}`}
          onMouseEnter={() => setHoveredZone('left')}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <div className={styles.circleContent}>
            <h4>{leftTitle}</h4>
            <ul>{leftItems.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </div>
        </div>

        {/* Right Circle */}
        <div 
          className={`${styles.circle} ${styles.right} ${hoveredZone === 'right' ? styles.active : ''}`}
          onMouseEnter={() => setHoveredZone('right')}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <div className={styles.circleContent}>
            <h4>{rightTitle}</h4>
            <ul>{rightItems.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </div>
        </div>

        {/* Intersection Zone Tracker (invisible, used for hover detect) */}
        <div 
          className={styles.intersectionHoverZone}
          onMouseEnter={() => setHoveredZone('intersection')}
          onMouseLeave={() => setHoveredZone(null)}
        ></div>
        
      </div>

      {/* Dynamic Info Panel */}
      <div className={`${styles.infoPanel} ${hoveredZone ? styles.panelActive : ''}`}>
        <div className={styles.infoContent}>
          {hoveredZone === 'left' && (
            <div className={styles.infoHighlight}><strong>{leftTitle}</strong></div>
          )}
          {hoveredZone === 'right' && (
            <div className={styles.infoHighlight}><strong>{rightTitle}</strong></div>
          )}
          {(!hoveredZone || hoveredZone === 'intersection') && (
            <div className={styles.intersectionData}>
              <span className={styles.badge}>Giao điểm</span>
              <p>{intersectionText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
