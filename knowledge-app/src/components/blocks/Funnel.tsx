import { useState } from 'react';
import type { FunnelBlock } from '../../types/schema';
import styles from './Funnel.module.css';

export function Funnel({ data }: { data: FunnelBlock['data'] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stagesRaw = data.stages || (data as any).levels || (data as any).items || [];
  const stages = stagesRaw.map((st: any) => ({
    name: st.name || st.title || st.label || '',
    description: st.description || st.desc || st.content || ''
  }));

  return (
    <div className={styles.container}>
      <div className={styles.funnelShape} onMouseLeave={() => setHoveredIndex(null)}>
        {stages.map((stage, idx) => {
          const isLocked = selectedIndex === idx;
          const isHovered = hoveredIndex === idx;
          const borderColor = isLocked ? 'var(--color-warning)' : (isHovered ? 'var(--color-accent-primary)' : 'transparent');
          
          return (
            <div 
              key={idx} 
              className={`${styles.stage} ${isLocked ? styles.active : ''}`}
              style={{ 
                '--index': idx, 
                '--total': stages.length,
                boxShadow: borderColor !== 'transparent' ? `inset 0 0 0 0.5px ${borderColor}` : 'none'
              } as React.CSSProperties}
              onClick={() => setSelectedIndex(isLocked ? null : idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <div className={styles.name} dangerouslySetInnerHTML={{ __html: stage.name }} />
            </div>
          );
        })}
      </div>
      
      <div className={styles.detailsPanel}>
        {(hoveredIndex !== null || selectedIndex !== null) && stages[hoveredIndex !== null ? hoveredIndex! : selectedIndex!] ? (
          <>
            <strong dangerouslySetInnerHTML={{ __html: stages[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].name }} />
            {stages[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].description && (
              <p dangerouslySetInnerHTML={{ __html: stages[hoveredIndex !== null ? hoveredIndex! : selectedIndex!].description }} />
            )}
          </>
        ) : (
          <div className={styles.placeholder}>Chạm vào một tầng để xem chi tiết</div>
        )}
      </div>
    </div>
  );
}
