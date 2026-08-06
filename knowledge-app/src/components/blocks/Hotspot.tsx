import { useState } from 'react';
import type { HotspotBlock } from '../../types/schema';
import styles from './Hotspot.module.css';

export function Hotspot({ data }: { data: HotspotBlock['data'] }) {
  // Mặc định chọn điểm đầu tiên để Box Chi Tiết bên dưới luôn hiển thị sẵn
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ptsRaw = data.points || (data as any).spots || [];
  const points = ptsRaw.map((pt: any) => ({
    title: pt.title || pt.label || pt.name || '',
    description: pt.description || pt.desc || pt.content || ''
  }));

  if (points.length === 0) return null;

  const activeIdx = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activePoint = points[activeIdx] || points[0];

  return (
    <div className={styles.container}>
      <div className={styles.imagePlaceholder}>
        <div className={styles.bgWrapper}>
          <div className={styles.scanline}></div>
        </div>
        {points.map((pt, i) => {
          // Phân bố đều các điểm theo chiều ngang (x) để luôn cân đối 2 bên
          const totalPoints = points.length;
          const x = ((i + 1) * 100) / (totalPoints + 1);
          
          // Chiều dọc (y) đi theo zizag (nhảy lên xuống quanh trục giữa)
          // i chẵn nằm trên (35%), i lẻ nằm dưới (65%)
          const y = i % 2 === 0 ? 35 : 65;

          const isTopRow = y <= 50;
          const isLeftEdge = x <= 30;
          const isRightEdge = x >= 70;

          // Xác định class vị trí tooltip thông minh chống tràn lề (Smart Boundary Clamping)
          let tooltipPosClass = styles.tooltipCenter;
          if (isLeftEdge) tooltipPosClass = styles.tooltipLeft;
          if (isRightEdge) tooltipPosClass = styles.tooltipRight;

          const rowClass = isTopRow ? styles.tooltipBelow : styles.tooltipAbove;

          const isCurActive = activeIdx === i;

          return (
            <div 
              key={i} 
              className={`${styles.spot} ${isCurActive ? styles.activeSpot : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(i)}
            >
              <div className={styles.pulse}></div>
              <div className={styles.dot}>{i + 1}</div>
              
              <div className={`${styles.tooltip} ${tooltipPosClass} ${rowClass} ${isCurActive ? styles.showTooltip : ''}`}>
                <h4>{pt.title}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cơ chế mở rộng vùng: Box Chi Tiết Độc Lập nằm dưới cữ không gian, không bao giờ tràn lề hay tràn xuống component khác */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div className={styles.detailBadge}>{activeIdx + 1}</div>
          <h4 className={styles.detailTitle} dangerouslySetInnerHTML={{ __html: activePoint.title }} />
        </div>
        {activePoint.description && (
          <p className={styles.detailDesc} dangerouslySetInnerHTML={{ __html: activePoint.description }} />
        )}
      </div>
    </div>
  );
}
