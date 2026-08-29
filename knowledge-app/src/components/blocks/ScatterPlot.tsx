import { useState } from 'react';
import type { ScatterPlotBlock } from '../../types/schema';
import styles from './ScatterPlot.module.css';

export function ScatterPlot({ data }: { data: ScatterPlotBlock['data'] }) {
  const points = data.points || [];
  const [selectedPoint, setSelectedPoint] = useState<ScatterPlotBlock['data']['points'][0] | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPlotBlock['data']['points'][0] | null>(null);

  if (points.length === 0) return null;

  const width = 550;
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 45, left: 45 };

  const renderWrappedText = (text: string, x: number, y: number, maxChars: number = 14) => {
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
    const displayLines = lines.slice(0, 2); // Show max 2 lines above point

    return (
      <text x={x} y={y - (displayLines.length - 1) * 12} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" style={{ pointerEvents: 'none' }}>
        {displayLines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const maxX = data.xMax ?? Math.max(...xs, 100);
  const minX = data.xMin ?? Math.min(...xs, 0);
  const maxY = data.yMax ?? Math.max(...ys, 100);
  const minY = data.yMin ?? Math.min(...ys, 0);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const getX = (xVal: number) => margin.left + ((xVal - minX) / rangeX) * plotWidth;
  const getY = (yVal: number) => margin.top + plotHeight - ((yVal - minY) / rangeY) * plotHeight;

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
          {/* Grid lines */}
          {[0, 0.5, 1].map((step, i) => {
            const yVal = minY + rangeY * step;
            const y = getY(yVal);
            return (
              <g key={i}>
                <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x={margin.left - 8} y={y + 4} textAnchor="end" className={styles.axisText}>{Math.round(yVal)}</text>
              </g>
            );
          })}
          {[0, 0.5, 1].map((step, i) => {
            const xVal = minX + rangeX * step;
            const x = getX(xVal);
            return (
              <g key={i}>
                <line x1={x} y1={margin.top} x2={x} y2={height - margin.bottom} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={x} y={height - margin.bottom + 18} textAnchor="middle" className={styles.axisText}>{Math.round(xVal)}</text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text x={margin.left + plotWidth / 2} y={height - 6} textAnchor="middle" fill="var(--color-text-muted)" fontSize="11" fontWeight="700">
            {data.xAxisLabel}
          </text>

          {/* Scatter Points */}
          {points.map((p, idx) => {
            const cx = getX(p.x);
            const cy = getY(p.y);
            const isSel = selectedPoint === p;
            const isHover = hoveredPoint === p;
            const isActive = isSel || isHover;
            const baseRadius = p.size ? Math.min(12, Math.max(4, p.size / 2)) : 6;

            return (
              <g
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedPoint(selectedPoint === p ? null : p)}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? Math.max(9, baseRadius + 2) : baseRadius}
                  fill={isActive ? 'var(--color-accent-secondary)' : 'var(--color-accent-primary)'}
                  stroke={isActive ? 'var(--color-warning)' : 'var(--color-accent-primary)'}
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {renderWrappedText(p.name, cx, cy - (baseRadius + 6))}
              </g>
            );
          })}
        </svg>

        {(selectedPoint || hoveredPoint || points[0]) && (() => {
          const pt = selectedPoint || hoveredPoint || points[0];
          return (
            <div className={styles.detailsBox}>
              <div className={styles.detailsTitle}>{pt.name}</div>
              <div className={styles.detailsText}>
                <div><strong>{data.xAxisLabel}:</strong> {pt.x}</div>
                <div><strong>{data.yAxisLabel}:</strong> {pt.y}</div>
                {pt.category && <div>{pt.category}</div>}
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}>
                  {pt.strategy}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
