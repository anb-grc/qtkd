import { useState, useId } from 'react';
import type { OnionBlock } from '../../types/schema';
import styles from './Onion.module.css';

/* Bottom-anchored concentric rings with curved SVG text paths and refined active borders */
export function Onion({ data }: { data: OnionBlock['data'] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const instanceId = useId();
  const layersRaw = data.layers || (data as any).levels || [];
  const layers = layersRaw.map((l: any) => ({
    name: l.name || l.title || l.label || '',
    description: l.description || l.desc || l.content || l.note || ''
  }));
  const reversed = [...layers].reverse();
  
  const palette = [
    'var(--color-accent-primary)', // Purple
    'var(--color-info)',           // Blue
    'var(--color-success)',        // Green/Teal
    'var(--color-warning)',        // Yellow
    'var(--color-danger)',         // Red
    '#e84393',                     // Pink
  ];

  // Display priority: hovered > locked > first layer
  const displayIdx = hoveredIndex !== null ? hoveredIndex : (activeIndex !== null ? activeIndex : 0);
  const displayLayer = layers[displayIdx];

  return (
    <div className={styles.container}>
      <div className={styles.onionWrapper} onMouseLeave={() => setHoveredIndex(null)}>
        {reversed.map((layer, idx) => {
          const originalIdx = reversed.length - 1 - idx;
          const isCore = idx === reversed.length - 1;
          const minSize = 44;
          const size = 100 - (idx * ((100 - minSize) / Math.max(1, reversed.length - 1)));
          const baseColor = palette[originalIdx % palette.length];
          const isActive = activeIndex === originalIdx;
          const isHovered = hoveredIndex === originalIdx;
          const isHighlighted = isActive || isHovered;
          
          const fontSize = 420 / size;
          const R = 50 - (2.5 + fontSize);
          const arcId = `arc-${instanceId.replace(/:/g, '')}-${originalIdx}`;
          
          return (
            <div 
              key={idx} 
              className={`${styles.layer} ${isHighlighted ? styles.active : ''} ${isCore ? styles.coreLayer : ''}`}
              style={{ 
                width: `${size}%`, 
                height: `${size}%`,
                zIndex: idx,
                background: `color-mix(in srgb, ${baseColor} 25%, transparent)`,
                borderColor: isHighlighted ? 'var(--color-warning)' : `color-mix(in srgb, ${baseColor} 50%, transparent)`,
                borderWidth: isHighlighted ? '1.5px' : '1px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(isActive ? null : originalIdx);
              }}
              onMouseEnter={() => setHoveredIndex(originalIdx)}
            >
              {isCore ? (
                <div className={styles.layerContent}>
                  <span className={`${styles.label} ${styles.coreLabel}`}>{layer.name}</span>
                </div>
              ) : (
                <svg viewBox="0 0 100 100" className={styles.arcSvg}>
                  <defs>
                    <path id={arcId} d={`M ${50 - R},50 A ${R},${R} 0 0 1 ${50 + R},50`} />
                  </defs>
                  <text className={styles.arcText} style={{ fontSize: `${fontSize}px`, fontWeight: 700 }}>
                    <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                      {layer.name}
                    </textPath>
                  </text>
                </svg>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.details}>
        {displayLayer && (
          <>
            <div className={styles.detailHeader}>
              <div className={styles.dot} style={{ background: palette[displayIdx % palette.length], borderColor: palette[displayIdx % palette.length], boxShadow: `0 0 8px ${palette[displayIdx % palette.length]}` }}></div>
              <strong>{displayLayer.name}</strong>
            </div>
            {displayLayer.description && <p>{displayLayer.description}</p>}
          </>
        )}
      </div>
    </div>
  );
}
