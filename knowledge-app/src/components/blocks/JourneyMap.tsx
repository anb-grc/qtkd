import { useState } from 'react';
import type { JourneyMapBlock } from '../../types/schema';
import styles from './JourneyMap.module.css';

export function JourneyMap({ data }: { data: JourneyMapBlock['data'] }) {
  const stages = (data.stages || []).map((st: any) => ({
    ...st,
    stage: typeof st.stage === 'string' ? st.stage.replace(/^(Bước\s+)?\d+[\.\-\)]?\s*/i, '') : st.stage
  }));
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (stages.length === 0) return null;
  
  const displayIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;
  const currentStage = stages[displayIdx] || stages[0];

  return (
    <div className={styles.container}>
      {data.persona && (
        <div className={styles.personaText}>
          {data.persona}
        </div>
      )}

      {/* Đã gỡ bỏ tiêu đề hardcode GIẢI MÃ BẢN CHẤT vì BlockWrapper đã tự động render title từ schema */}

      <div className={styles.stageTabs} onMouseLeave={() => setHoveredIdx(null)}>
        {stages.map((st, idx) => {
          const isLocked = idx === activeIdx;
          const isHovered = idx === hoveredIdx;
          const borderColor = isLocked ? 'var(--color-warning)' : (isHovered ? 'var(--color-accent-primary)' : 'rgba(255, 255, 255, 0.08)');

          return (
            <button
              key={idx}
              className={`${styles.stageTab} ${isLocked ? styles.activeTab : ''}`}
              style={{ border: `0.5px solid ${borderColor}` }}
              onClick={() => setActiveIdx(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              <span className={styles.stageNumber}>{idx + 1}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.stage}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.cardContent}>


        {/* Trọng tâm (action) */}
        {currentStage.action && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.actionLabel || 'Trọng tâm'}</div>
            <div className={styles.secText} dangerouslySetInnerHTML={{ __html: currentStage.action }} />
          </div>
        )}

        {currentStage.painPoint && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.painPointLabel || 'Nhận thức sai'}</div>
            <div className={styles.secText} dangerouslySetInnerHTML={{ __html: currentStage.painPoint }} />
          </div>
        )}

        {currentStage.solution && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.solutionLabel || 'Cách tiếp cận đúng'}</div>
            <div className={styles.secText} dangerouslySetInnerHTML={{ __html: currentStage.solution }} />
          </div>
        )}

        {currentStage.trapWarning && (
          <div style={{ padding: 'var(--space-sm) var(--space-md)', background: 'rgba(255, 71, 87, 0.12)', border: '1px solid rgba(255, 71, 87, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: 'var(--text-sm)' }}>
            <span dangerouslySetInnerHTML={{ __html: currentStage.trapWarning }} />
          </div>
        )}
      </div>
    </div>
  );
}
