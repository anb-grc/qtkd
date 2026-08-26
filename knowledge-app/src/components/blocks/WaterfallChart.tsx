import { useState } from 'react';
import type { WaterfallChartBlock } from '../../types/schema';
import styles from './WaterfallChart.module.css';

export function WaterfallChart({ data }: { data: WaterfallChartBlock['data'] }) {
  const steps = data.steps || [];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (steps.length === 0) return null;

  const width = 600;
  const height = 320;
  const margin = { top: 35, right: 25, bottom: 70, left: 45 };

  const renderWrappedText = (text: string, x: number, y: number, className?: string, maxChars: number = 12) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(w => {
      if (!currentLine || (currentLine + ' ' + w).length <= maxChars) {
        currentLine = currentLine ? currentLine + ' ' + w : w;
      } else {
        lines.push(currentLine);
        currentLine = w;
      }
    });
    if (currentLine) lines.push(currentLine);
    const displayLines = lines.slice(0, 3);

    return (
      <text x={x} y={y} textAnchor="middle" className={className}>
        {displayLines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : 13}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  let currentVal = 0;
  const bars: { label: string; val: number; start: number; end: number; type?: 'start' | 'add' | 'sub' | 'total'; note?: string; explanation?: string }[] = [];

  steps.forEach((st) => {
    if (st.type === 'start' || st.type === 'total') {
      bars.push({ label: st.label, val: st.value, start: 0, end: st.value, type: st.type, note: st.note, explanation: st.explanation });
      currentVal = st.value;
    } else if (st.type === 'sub') {
      const nextVal = currentVal - Math.abs(st.value);
      bars.push({ label: st.label, val: -Math.abs(st.value), start: currentVal, end: nextVal, type: st.type, note: st.note, explanation: st.explanation });
      currentVal = nextVal;
    } else {
      // Default or add
      const nextVal = currentVal + st.value;
      bars.push({ label: st.label, val: st.value, start: currentVal, end: nextVal, type: st.type || 'add', note: st.note, explanation: st.explanation });
      currentVal = nextVal;
    }
  });

  const allVals = bars.flatMap(b => [b.start, b.end, 0]);
  const maxVal = Math.max(...allVals, 100);
  const minVal = Math.min(...allVals, 0);
  const range = maxVal - minVal || 1;

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const colWidth = plotWidth / Math.max(1, bars.length);
  const barWidth = Math.min(48, colWidth * 0.7);

  const getX = (i: number) => margin.left + i * colWidth + (colWidth - barWidth) / 2;
  const getY = (v: number) => margin.top + plotHeight - ((v - minVal) / range) * plotHeight;

  const selectedBar = bars[selectedIdx ?? hoveredIdx ?? 0] || bars[0];

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
          {[0, 0.5, 1].map((step, i) => {
            const v = minVal + range * step;
            const y = getY(v);
            return (
              <g key={i}>
                <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x={margin.left - 8} y={y + 4} textAnchor="end" className={styles.axisText}>{Math.round(v)}</text>
              </g>
            );
          })}

          {/* Step connector lines */}
          {bars.map((b, idx) => {
            if (idx === 0) return null;
            const prevX = getX(idx - 1) + barWidth;
            const currX = getX(idx);
            const y = getY(b.start);
            return (
              <line
                key={`conn-${idx}`}
                x1={prevX}
                y1={y}
                x2={currX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
            );
          })}

          {bars.map((b, idx) => {
            const x = getX(idx);
            const y1 = getY(b.start);
            const y2 = getY(b.end);
            const topY = Math.min(y1, y2);
            const barH = Math.max(2, Math.abs(y1 - y2));

            let fillColor = 'var(--color-accent-primary)';
            if (b.type === 'start' || b.type === 'total') fillColor = 'var(--color-accent-secondary)';
            else if (b.type === 'sub') fillColor = 'var(--color-danger, #ff4757)';
            else fillColor = 'var(--color-success, #2ed573)';

            const isSel = selectedIdx === idx;
            const isHover = hoveredIdx === idx;
            const isActive = isSel || isHover;

            return (
              <g
                key={idx}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <rect
                  x={x}
                  y={topY}
                  width={barWidth}
                  height={barH}
                  fill={fillColor}
                  stroke={isActive ? '#fff' : 'none'}
                  strokeWidth={isActive ? '1.5' : '0'}
                  rx="3"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x={x + barWidth / 2} y={topY - 8} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                  {b.val > 0 && b.type !== 'start' && b.type !== 'total' ? `+${b.val}` : b.val}
                </text>
                {renderWrappedText(b.label, x + barWidth / 2, margin.top + plotHeight + 20, styles.axisText, 12)}
              </g>
            );
          })}
        </svg>

        <div className={styles.legendBox}>
          <div className={styles.legendTitle}>
            {selectedBar.label}: {selectedBar.val}{data.unit ? ` ${data.unit}` : ''} ({selectedBar.type?.toUpperCase() || 'ADD'})
          </div>
          {selectedBar.note && <div className={styles.legendDesc} style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{selectedBar.note}</div>}
          {selectedBar.explanation && <div className={styles.legendDesc} dangerouslySetInnerHTML={{ __html: selectedBar.explanation }} />}
        </div>
      </div>
    </div>
  );
}
