import { useState } from 'react';
import type { PyramidBlock } from '../../types/schema';
import styles from './Pyramid.module.css';

export function Pyramid({ data }: { data: PyramidBlock['data'] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const levelsRaw = data.levels || (data as any).layers || (data as any).stages || (data as any).items || [];
  const levels = levelsRaw.map((l: any) => ({
    name: l.name || l.title || l.label || '',
    description: l.description || l.desc || l.content || ''
  }));

  return (
    <div className={styles.container}>
      <div className={styles.pyramidWrapper} onMouseLeave={() => setHoveredIndex(null)}>
        {levels.map((level, idx) => {
          const isLocked = selectedIndex === idx;
          const isHovered = hoveredIndex === idx;
          const borderColor = isLocked ? '#ffffff' : (isHovered ? 'var(--color-accent-primary)' : 'transparent');

          return (
            <div 
              key={idx} 
              className={`${styles.level} ${isLocked ? styles.active : ''}`}
              style={{ 
                '--index': idx, 
                '--total': levels.length,
                boxShadow: borderColor !== 'transparent' ? `inset 0 0 0 0.5px ${borderColor}` : 'none'
              } as React.CSSProperties}
              onClick={() => setSelectedIndex(isLocked ? null : idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className={styles.name} dangerouslySetInnerHTML={{ __html: level.name }} />
            </div>
          );
        })}
      </div>
      
      <div className={styles.detailsPanel}>
        {(hoveredIndex !== null || selectedIndex !== null) && levels[hoveredIndex !== null ? hoveredIndex! : selectedIndex!] ? (
          <>
            <strong dangerouslySetInnerHTML={{ __html: levels[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].name }} />
            {levels[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].description && (
              <p dangerouslySetInnerHTML={{ __html: levels[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].description }} />
            )}
          </>
        ) : (
          <div className={styles.placeholder}>Chạm vào một tầng để xem chi tiết</div>
        )}
      </div>
    </div>
  );
}
