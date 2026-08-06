import type { GaugeChartBlock } from '../../types/schema';
import styles from './GaugeChart.module.css';

export function GaugeChart({ data }: { data: GaugeChartBlock['data'] }) {
  const min = data.min ?? 0;
  const max = data.max ?? 100;
  const val = data.currentValue ?? 0;
  const range = max - min || 1;
  const ratio = Math.min(1, Math.max(0, (val - min) / range));
  const angle = -90 + ratio * 180;

  const width = 360;
  const height = 200;
  const cx = width / 2;
  const cy = 165;
  const r = 125;

  const zones = data.zones || [
    { min: 0, max: 40, label: 'Thấp', color: '#ff4757', advice: 'Cần chú ý củng cố kiến thức gốc.' },
    { min: 40, max: 75, label: 'Trung bình', color: '#ffa502', advice: 'Đạt mức ổn, cần tiếp tục luyện tập.' },
    { min: 75, max: 100, label: 'Cao / Chuẩn', color: '#2ed573', advice: 'Tuyệt vời, sẵn sàng thực chiến!' }
  ];

  const currentZone = zones.find(z => val >= z.min && val <= z.max) || zones[zones.length - 1] || { label: 'Bình thường', color: '#00cec9', advice: 'Không có lời khuyên cụ thể.' };

  return (
    <div className={styles.container}>
      <div className={styles.gaugeContainer}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgWrapper}>
            {/* Base arch */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="24"
            />
            {/* Colored highlight arch */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke={currentZone.color || 'var(--color-accent-secondary)'}
              strokeWidth="24"
              strokeDasharray={Math.PI * r}
              strokeDashoffset={Math.PI * r * (1 - ratio)}
            />

            {/* Needle */}
            <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
              <polygon points="-5,0 5,0 0,-115" fill="var(--color-accent-secondary)" />
              <circle cx="0" cy="0" r="12" fill="var(--color-accent-primary)" />
              <circle cx="0" cy="0" r="5" fill="#fff" />
            </g>

            <text x={cx - r} y={cy + 22} textAnchor="middle" fill="var(--color-text-muted)" fontSize="13" fontWeight="700">{min}</text>
            <text x={cx + r} y={cy + 22} textAnchor="middle" fill="var(--color-text-muted)" fontSize="13" fontWeight="700">{max}</text>
          </svg>
        </div>

        <div className={styles.gaugeValueBox}>
          <div className={styles.gaugeValueText}>
            {val}{data.unit ? ` ${data.unit}` : ''}
          </div>
          {data.valueLabel && (
            <div className={styles.gaugeSubtitle} style={{ color: currentZone.color || 'var(--color-accent-secondary)' }}>
              {data.valueLabel}
            </div>
          )}
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>
            Trạng thái: <span style={{ color: currentZone.color || 'var(--color-accent-secondary)' }}>{currentZone.label}</span>
          </div>
          {currentZone.advice && (
            <div className={styles.infoAdvice} dangerouslySetInnerHTML={{ __html: currentZone.advice }} />
          )}
        </div>
      </div>
    </div>
  );
}
