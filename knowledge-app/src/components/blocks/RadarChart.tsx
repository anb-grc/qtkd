import { useState } from 'react';
import type { RadarChartBlock } from '../../types/schema';
import styles from './RadarChart.module.css';

export function RadarChart({ data }: { data: RadarChartBlock['data'] }) {
  const axes = data.axes || [];
  const datasets = data.datasets || [];
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const numAxes = axes.length || 5;
  const radius = 100;
  const center = 160;

  const getCoordinates = (value: number, idx: number, maxVal = 100) => {
    const angle = (Math.PI * 2 * idx) / numAxes - Math.PI / 2;
    const dist = (value / maxVal) * radius;
    const x = center + dist * Math.cos(angle);
    const y = center + dist * Math.sin(angle);
    return { x, y };
  };

  const renderWrappedText = (text: string, x: number, y: number, textAnchor: 'start' | 'middle' | 'end', maxChars = 12) => {
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

    const startY = y - ((displayLines.length - 1) * 6);

    return (
      <text
        x={x}
        y={startY}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className={styles.axisText}
      >
        {displayLines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className={styles.container}>
      {/* Notice: Title is rendered by BlockWrapper to preserve Editorial Clean symmetry */}
      <div className={styles.chartWrapper}>
        <svg viewBox="0 0 320 320" className={styles.svgBox}>
          {/* Concentric polygons */}
          {gridLevels.map((level, lIdx) => {
            const points = axes.map((_, i) => {
              const { x, y } = getCoordinates(level, i);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={lIdx}
                points={points}
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeDasharray={level === 100 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            );
          })}

          {/* Axis spoke lines & labels */}
          {axes.map((axisName, idx) => {
            const { x, y } = getCoordinates(100, idx);
            const labelCoord = getCoordinates(126, idx);
            const textAnchor = labelCoord.x < center - 10 ? 'end' : labelCoord.x > center + 10 ? 'start' : 'middle';

            return (
              <g key={idx}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                />
                {renderWrappedText(axisName, labelCoord.x, labelCoord.y, textAnchor)}
              </g>
            );
          })}

          {/* Dataset polygons & dots */}
          {datasets.map((ds, dsIdx) => {
            const isSel = activeIdx === null || activeIdx === dsIdx;
            const isHover = hoveredIdx === dsIdx;
            const isActive = activeIdx === dsIdx || isHover;

            const points = ds.values.map((val, i) => {
              const { x, y } = getCoordinates(val, i);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g
                key={dsIdx}
                style={{ opacity: isSel ? 1 : 0.2, transition: 'all 0.3s ease' }}
                onMouseEnter={() => setHoveredIdx(dsIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <polygon
                  points={points}
                  fill={ds.color || 'var(--color-accent-primary)'}
                  fillOpacity={isActive ? 0.35 : 0.18}
                  stroke={ds.color || 'var(--color-accent-primary)'}
                  strokeWidth={isActive ? 2 : 1.5}
                  onClick={() => {
                    setActiveIdx(activeIdx === dsIdx ? null : dsIdx);
                    setSelectedPoint(null);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {ds.values.map((val, i) => {
                  const { x, y } = getCoordinates(val, i);
                  const pointKey = `${dsIdx}-${i}`;
                  const isPointActive = selectedPoint === pointKey || hoveredPoint === pointKey;

                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isPointActive ? 3 : (isActive ? 2.25 : 1.75)}
                        fill={ds.color || 'var(--color-accent-primary)'}
                        stroke={isPointActive ? '#ffffff' : (ds.color || 'var(--color-accent-primary)')}
                        strokeWidth={isPointActive ? 1.5 : 1}
                        style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={12}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPoint(selectedPoint === pointKey ? null : pointKey);
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredPoint(pointKey);
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setHoveredPoint(null);
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Legend List / Interactive Toggles */}
        <div className={styles.legendList}>
          {datasets.map((ds, dsIdx) => {
            const isSel = activeIdx === null || activeIdx === dsIdx;
            const isHover = hoveredIdx === dsIdx;
            return (
              <div
                key={dsIdx}
                className={`${styles.legendItem} ${!isSel && !isHover ? styles.legendItemInactive : ''}`}
                onClick={() => setActiveIdx(activeIdx === dsIdx ? null : dsIdx)}
                onMouseEnter={() => setHoveredIdx(dsIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                role="button"
                tabIndex={0}
              >
                <span
                  className={styles.colorIndicator}
                  style={{ backgroundColor: ds.color || 'var(--color-accent-primary)' }}
                />
                <span>{ds.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
