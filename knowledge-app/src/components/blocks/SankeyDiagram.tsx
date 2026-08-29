import { useState } from 'react';
import type { SankeyDiagramBlock } from '../../types/schema';
import styles from './SankeyDiagram.module.css';

export function SankeyDiagram({ data }: { data: SankeyDiagramBlock['data'] }) {
  const flows = data.flows || [];
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (flows.length === 0) return null;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const activeFlow = flows[activeIdx] || flows[0];
  const totalValue = flows.reduce((acc, f) => acc + f.value, 0) || 1;

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        {/* Mobile-first interactive flows visual representation */}
        <div className={styles.flowsList} onMouseLeave={() => setHoveredIdx(null)}>
          {flows.map((f, idx) => {
            const pct = Math.round((f.value / totalValue) * 100);
            const isLocked = selectedIdx === idx;
            const isHovered = hoveredIdx === idx;
            const borderColor = isLocked ? 'var(--color-warning)' : (isHovered ? 'var(--color-accent-primary)' : 'rgba(255, 255, 255, 0.08)');

            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-sm)',
                  background: isLocked ? 'rgba(108, 92, 231, 0.15)' : 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
                  border: `0.5px solid ${borderColor}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--color-accent-primary)', fontWeight: 800 }}>{f.from}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>➔</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{f.to}</span>
                  </div>
                  <span style={{ color: f.highlight ? 'var(--color-success, #2ed573)' : 'var(--color-accent-secondary)', fontWeight: 900 }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(4, pct)}%`, height: '100%', background: f.highlight ? 'var(--color-success, #2ed573)' : 'var(--color-accent-secondary)', transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.legendBox}>
          <div className={styles.legendTitle}>
            Dòng chuyển dịch: {activeFlow.from} ➔ {activeFlow.to}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-secondary)', fontWeight: 700, margin: '4px 0' }}>
            Tỷ trọng phân bổ: {Math.round((activeFlow.value / totalValue) * 100)}% tổng quy mô
          </div>
          {activeFlow.explanation && (
            <div className={styles.legendDesc} dangerouslySetInnerHTML={{ __html: activeFlow.explanation }} />
          )}
        </div>
      </div>
    </div>
  );
}
