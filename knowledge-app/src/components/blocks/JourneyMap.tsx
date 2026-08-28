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

  const getEmotionBadge = (emotion?: 'positive' | 'neutral' | 'negative' | 'frustration', customText?: string) => {
    switch (emotion) {
      case 'positive': return <span style={{ color: 'var(--color-success, #2ed573)' }}>{customText || 'Trạng thái tự tin / Dễ ăn điểm'}</span>;
      case 'negative': return <span style={{ color: '#ffa502' }}>{customText || 'Dễ bối rối / Cần lưu ý'}</span>;
      case 'frustration': return <span style={{ color: 'var(--color-danger, #ff4757)' }}>{customText || 'Bẫy cực gắt / Dễ sập bẫy'}</span>;
      default: return <span style={{ color: 'var(--color-accent-secondary)' }}>{customText || 'Trạng thái trung lập / Bình tĩnh'}</span>;
    }
  };

  return (
    <div className={styles.container}>
      {data.persona && (
        <div className={styles.personaText}>
          {data.persona}
        </div>
      )}

      <div className={styles.stageTabs} onMouseLeave={() => setHoveredIdx(null)}>
        {stages.map((st, idx) => {
          const isLocked = idx === activeIdx;
          const isHovered = idx === hoveredIdx;
          const borderColor = isLocked ? '#ffffff' : (isHovered ? 'var(--color-accent-primary)' : 'rgba(255, 255, 255, 0.08)');

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
        {currentStage.action && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.actionLabel || 'Nội dung cốt lõi'}</div>
            <div className={styles.secText} dangerouslySetInnerHTML={{ __html: currentStage.action }} />
          </div>
        )}

        {currentStage.emotion && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.emotionLabel || 'Trạng thái ôn thi'}</div>
            <div className={styles.secText} style={{ fontWeight: 700 }}>
              {getEmotionBadge(currentStage.emotion, currentStage.emotionText)}
            </div>
          </div>
        )}

        {currentStage.painPoint && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.painPointLabel || 'Điểm mù / Dễ sai'}</div>
            <div className={styles.secText} dangerouslySetInnerHTML={{ __html: currentStage.painPoint }} />
          </div>
        )}

        {currentStage.solution && (
          <div className={styles.sectionGroup}>
            <div className={styles.secTitle}>{currentStage.solutionLabel || 'Tư duy gỡ rối'}</div>
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
