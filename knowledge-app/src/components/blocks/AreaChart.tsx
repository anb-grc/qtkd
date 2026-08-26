import { useState } from 'react';
import type { AreaChartBlock } from '../../types/schema';
import styles from './AreaChart.module.css';

export function AreaChart({ data }: { data: AreaChartBlock['data'] }) {
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
  const maxVal = Math.max(...vals, data.thresholdValue || 100);
  const minVal = Math.min(...vals, 0);
  const range = maxVal - minVal || 1;

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const getX = (idx: number) => margin.left + (idx * plotWidth) / Math.max(1, points.length - 1);
  const getY = (val: number) => margin.top + plotHeight - ((val - minVal) / range) * plotHeight;

  const topPoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');
  const bottomPoints = `${getX(points.length - 1)},${getY(0)} ${getX(0)},${getY(0)}`;
  const areaPoly = `${topPoints} ${bottomPoints}`;
  const currentPoint = points[selectedIdx ?? hoveredIdx ?? 0] || points[0];

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
          {/* Y Grid */}
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

          {/* Threshold Line */}
          {data.thresholdValue !== undefined && (
            <g>
              <line x1={margin.left} y1={getY(data.thresholdValue)} x2={width - margin.right} y2={getY(data.thresholdValue)} stroke="var(--color-danger, #ff4757)" strokeDasharray="5 3" strokeWidth="1.5" />
              {data.thresholdLabel && <text x={width - margin.right - 4} y={getY(data.thresholdValue) - 6} textAnchor="end" fill="var(--color-danger, #ff4757)" fontSize="11" fontWeight="700">{data.thresholdLabel}</text>}
            </g>
          )}

          {/* X Axis */}
          {points.map((p, idx) => (
            <g key={idx}>
              {renderWrappedText(p.label, getX(idx), margin.top + plotHeight + 20, styles.axisText, 12)}
            </g>
          ))}

          {/* Area polygon */}
          <polygon points={areaPoly} fill="var(--color-accent-primary)" fillOpacity="0.25" />
          <polyline points={topPoints} fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" />

          {/* Dots */}
          {points.map((p, idx) => {
            const isSel = selectedIdx === idx;
            const isHover = hoveredIdx === idx;
            const isActive = isSel || isHover;

            return (
              <g key={idx}>
                <circle
                  cx={getX(idx)}
                  cy={getY(p.value)}
                  r={isActive ? 2.25 : 1.75}
                  fill={isActive ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)'}
                  stroke={isActive ? '#ffffff' : 'var(--color-accent-primary)'}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
                />
                <circle
                  cx={getX(idx)}
                  cy={getY(p.value)}
                  r={12}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedIdx(selectedIdx === idx ? null : idx)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        <div className={styles.legendList}>
          <div style={{ padding: 0, background: 'transparent', border: 'none', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--color-accent-secondary)', marginBottom: '4px' }}>
              {currentPoint.label} ({currentPoint.value})
            </div>
            {currentPoint.note && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: currentPoint.note }} />}
            {data.positiveRegionExplanation && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: '4px' }}>{data.positiveRegionExplanation}</div>}
            {data.negativeRegionExplanation && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', marginTop: '4px' }}>{data.negativeRegionExplanation}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
