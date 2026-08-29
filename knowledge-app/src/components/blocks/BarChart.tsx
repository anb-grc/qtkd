import { useState } from 'react';
import type { BarChartBlock } from '../../types/schema';
import styles from './BarChart.module.css';

export function BarChart({ data }: { data: BarChartBlock['data'] }) {
  const items = data.items || [];
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (items.length === 0) return null;

  const maxVal = data.maxValue || Math.max(...items.map(i => i.value), 100);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const activeItem = items[activeIdx] || items[0];

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <div className={styles.barsList} onMouseLeave={() => setHoveredIdx(null)}>
          {items.map((item, idx) => {
            const pct = Math.min(100, Math.max(2, (item.value / (maxVal || 1)) * 100));
            const isLocked = selectedIdx === idx;
            const isHovered = hoveredIdx === idx;
            const borderColor = isLocked ? 'var(--color-warning)' : (isHovered ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.08)');

            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-sm)',
                  background: isLocked ? 'rgba(108, 92, 231, 0.12)' : 'var(--glass-bg, rgba(255,255,255,0.03))',
                  border: `0.5px solid ${borderColor}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--color-accent-secondary)' }}>{item.value}{item.unit ? ` ${item.unit}` : ''}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.highlight ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.legendList}>
          <div style={{ padding: 0, background: 'transparent', border: 'none', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--color-accent-secondary)', marginBottom: '4px' }}>
              {activeItem.label}: {activeItem.value}{activeItem.unit ? ` ${activeItem.unit}` : ''}
            </div>
            {activeItem.explanation ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }} dangerouslySetInnerHTML={{ __html: activeItem.explanation }} />
            ) : (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Chạm vào từng thanh dữ liệu để xem thông tin chi tiết.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
