import { useState } from 'react';
import type { CycleBlock } from '../../types/schema';
import styles from './Cycle.module.css';

export function Cycle({ data }: { data: CycleBlock['data'] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stepsRaw = data.steps || (data as any).items || [];
  const steps = stepsRaw.map((s: any) => ({
    name: s.name || s.title || s.label || '',
    description: s.description || s.desc || s.content || ''
  }));
  const count = steps.length;
  const isCompact = count >= 6;
  
  return (
    <div className={styles.container}>
      <div className={`${styles.circleContainer} ${isCompact ? styles.compact : ''}`} onMouseLeave={() => setHoveredIndex(null)}>
        {steps.map((step, i) => {
          const angle = (i / Math.max(1, count)) * 360;
          const isLocked = selectedIndex === i;
          const isHovered = hoveredIndex === i;
          const borderColor = isLocked ? 'var(--color-warning)' : (isHovered ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)');
          return (
            <div 
              key={i} 
              className={`${styles.nodeWrapper} ${isLocked ? styles.active : ''}`}
              style={{ '--angle': `${angle}deg` } as React.CSSProperties}
              onClick={() => setSelectedIndex(isLocked ? null : i)}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <div className={styles.node} style={{ border: `0.5px solid ${borderColor}` }}>
                <div className={styles.index}>{i + 1}</div>
                <div className={styles.name}>{step.name}</div>
              </div>
            </div>
          );
        })}
        <div className={styles.centerNode}></div>
      </div>
      
      <div className={styles.detailsPanel}>
        {(hoveredIndex !== null || selectedIndex !== null) && steps[hoveredIndex !== null ? hoveredIndex : selectedIndex!] ? (
          <>
            <div className={styles.detailHeader}>
              <div className={styles.detailBadge}>{hoveredIndex !== null ? hoveredIndex + 1 : selectedIndex! + 1}</div>
              <strong>{steps[hoveredIndex !== null ? hoveredIndex : selectedIndex!].name}</strong>
            </div>
            {steps[hoveredIndex !== null ? hoveredIndex : selectedIndex!].description && <p>{steps[hoveredIndex !== null ? hoveredIndex : selectedIndex!].description}</p>}
          </>
        ) : (
          <div className={styles.placeholder}>Chạm vào một nút để xem chi tiết</div>
        )}
      </div>
    </div>
  );
}
