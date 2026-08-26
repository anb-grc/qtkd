import { useState } from 'react';
import type { TreemapBlock } from '../../types/schema';
import styles from './Treemap.module.css';

export function Treemap({ data }: { data: TreemapBlock['data'] }) {
  const items = data.items || [];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (items.length === 0) return null;

  const width = 600;
  const height = 320;
  const totalVal = items.reduce((acc, i) => acc + Math.max(1, i.value), 0) || 1;

  let currX = 0;
  let currY = 0;
  let remWidth = width;
  let remHeight = height;

  const rects = items.map((it, idx) => {
    const isHorizontal = remWidth >= remHeight;
    const remVal = items.slice(idx).reduce((acc, i) => acc + Math.max(1, i.value), 0) || 1;
    const ratio = Math.max(1, it.value) / remVal;

    let w = remWidth;
    let h = remHeight;

    if (idx === items.length - 1) {
      w = remWidth;
      h = remHeight;
    } else if (isHorizontal) {
      const shareW = Math.round(remWidth * (idx === 0 ? Math.min(0.55, ratio * 1.3) : ratio));
      w = Math.max(115, Math.min(shareW, remWidth - 115));
      h = remHeight;
    } else {
      const shareH = Math.round(remHeight * ratio);
      h = Math.max(85, Math.min(shareH, remHeight - 85));
      w = remWidth;
    }

    const res = { ...it, x: currX, y: currY, w: Math.max(40, w), h: Math.max(40, h), origIndex: idx };
    if (isHorizontal && idx < items.length - 1) {
      currX += w;
      remWidth = Math.max(0, remWidth - w);
    } else if (!isHorizontal && idx < items.length - 1) {
      currY += h;
      remHeight = Math.max(0, remHeight - h);
    }
    return res;
  });

  return (
    <div className={styles.container}>
      <div className={styles.gridWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
          {rects.map((r, idx) => {
            const isSel = selectedIdx === idx;
            const isHov = hoveredIdx === idx;
            const isHi = r.highlight;

            const fillCol = isHi ? 'rgba(0, 206, 201, 0.35)' : 'rgba(108, 92, 231, 0.25)';
            const borderCol = (isSel || isHov) ? '#ffffff' : 'rgba(255, 255, 255, 0.14)';

            return (
              <g
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedIdx(prev => prev === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <rect
                  x={r.x + 2}
                  y={r.y + 2}
                  width={Math.max(2, r.w - 4)}
                  height={Math.max(2, r.h - 4)}
                  fill={fillCol}
                  stroke={borderCol}
                  strokeWidth="0.5"
                  rx="8"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <foreignObject
                  x={r.x + 4}
                  y={r.y + 4}
                  width={Math.max(2, r.w - 8)}
                  height={Math.max(2, r.h - 8)}
                  style={{ pointerEvents: 'none' }}
                >
                  <div className={styles.cellContent}>
                    <div
                      className={styles.cellTitle}
                      style={{ fontSize: r.w > 220 ? '15px' : '13px' }}
                    >
                      {r.name}
                    </div>
                    <div className={styles.cellShare}>
                      {Math.round((Math.max(1, r.value) / totalVal) * 100)}%
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        <div className={styles.infoBox}>
          {selectedIdx !== null && items[selectedIdx] ? (
            <>
              <div className={styles.infoTitle}>
                {items[selectedIdx].name} {items[selectedIdx].category ? `(${items[selectedIdx].category})` : ''}
              </div>
              <div className={styles.infoWeight}>
                Tỷ trọng: {Math.round((items[selectedIdx].value / totalVal) * 100)}% tổng cấu trúc
              </div>
              {items[selectedIdx].details ? (
                <div className={styles.infoVal} dangerouslySetInnerHTML={{ __html: items[selectedIdx].details! }} />
              ) : (
                <div className={styles.infoVal} style={{ color: 'var(--color-text-muted)' }}>
                  Không có mô tả chi tiết cho khối này.
                </div>
              )}
            </>
          ) : (
            <div className={styles.placeholderBox}>
              <div className={styles.infoTitle}>Bản Đồ Trọng Lượng Cấu Trúc</div>
              <div className={styles.infoVal} style={{ color: 'var(--color-text-muted)' }}>
                Chạm hoặc rê chuột (hover / click) vào từng khối phân vùng trên biểu đồ để bật viền trắng 1.5px và bóc tách chi tiết.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
