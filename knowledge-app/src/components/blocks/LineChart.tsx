import { useState } from 'react';
import type { LineChartBlock } from '../../types/schema';
import styles from './LineChart.module.css';

export function LineChart({ data }: { data: LineChartBlock['data'] }) {
  const points = data.points || [];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (points.length === 0) return null;

  const width = 600;
  const height = 320;
  const margin = { top: 30, right: 30, bottom: 65, left: 45 };

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

  const vals = points.map(p => p.value);
  const maxVal = Math.max(...vals, 100);
  const minVal = Math.min(...vals, 0);
  const range = maxVal - minVal || 1;

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const getX = (idx: number) => margin.left + (idx * plotWidth) / Math.max(1, points.length - 1);
  const getY = (val: number) => margin.top + plotHeight - ((val - minVal) / range) * plotHeight;

  const polylinePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');
  const currentPoint = points[hoveredIdx ?? selectedIdx ?? 0] || points[0];

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
          {/* Grid lines */}
          {[0, 0.5, 1].map((step, i) => {
            const v = minVal + range * step;
            const y = getY(v);
            return (
              <g key={i}>
                <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                <text x={margin.left - 8} y={y + 4} textAnchor="end" className={styles.axisText}>{Math.round(v)}</text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              {renderWrappedText(p.label, getX(idx), margin.top + plotHeight + 20, styles.axisText, 12)}
            </g>
          ))}

          {/* Main line path */}
          <polyline
            fill="none"
            stroke="var(--color-accent-secondary)"
            strokeWidth="1.5"
            points={polylinePoints}
          />

          {/* Dots */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.value);
            const isSel = selectedIdx === idx;
            const isHover = hoveredIdx === idx;
            const isActive = isSel || isHover;

            return (
              <g
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 2.25 : 1.75}
                  fill={isActive ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}
                  stroke={isActive ? '#ffffff' : 'var(--color-accent-secondary)'}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="transparent"
                />
                <text x={x} y={y - 12} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                  {p.value}
                </text>
              </g>
            );
          })}
        </svg>

        <div className={styles.legendList}>
          <div style={{ padding: 0, background: 'transparent', border: 'none', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--color-accent-secondary)', marginBottom: '4px' }}>
              {currentPoint.label}: {currentPoint.value}
            </div>
            {currentPoint.annotation && <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{currentPoint.annotation}</div>}
            {currentPoint.explanation && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: currentPoint.explanation }} />}
          </div>
        </div>
      </div>
    </div>
  );
}
