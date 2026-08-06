import { useState } from 'react';
import type { ProcessStepsBlock, FlowchartBlock } from '../../types/schema';
import styles from './Process.module.css';

/* Process Steps with rotating diamond waypoints, opaque background, and synchronized title tilt */
export function ProcessSteps({ data }: { data: ProcessStepsBlock['data'] | FlowchartBlock['data'] }) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const stepsRaw = data.steps || (data as any).items || [];
  const steps = stepsRaw.map((s: any) => ({
    name: s.name || s.title || s.label || '',
    description: s.description || s.desc || s.content || ''
  }));

  return (
    <div className={styles.container}>
      {steps.map((step, idx) => {
        const isOpen = !!openStates[idx];
        return (
          <div key={idx} className={styles.stepWrapper}>
            <div 
              className={`${styles.stepCard} ${isOpen ? styles.open : ''}`} 
              style={{'--delay': `${idx * 0.1}s`} as React.CSSProperties}
              onClick={() => setOpenStates(prev => ({ ...prev, [idx]: !prev[idx] }))}
            >
              <div className={styles.numberWrapper}>
                <div className={styles.numberBg} />
                <span className={styles.numberText}>{idx + 1}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.header}>
                  <h4>{step.name}</h4>
                  {step.description && <div className={styles.chevron}>{isOpen ? '▲' : '▼'}</div>}
                </div>
                {step.description && (
                  <div className={styles.descWrapper}>
                    <p>{step.description}</p>
                  </div>
                )}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={styles.arrow}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
