import { useState } from 'react';
import type { QuizBlock } from '../../types/schema';
import styles from './Quiz.module.css';

export function Quiz({ data }: { data: QuizBlock['data'] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const rawOptions = data.options || (data as any).choices || [];
  const options = rawOptions.map((opt: any) => typeof opt === 'string' ? opt : (opt.text || opt.label || opt.content || ''));
  const correctIdx = typeof data.correctAnswer === 'number' ? data.correctAnswer : ((data as any).answer || 0);

  const isCorrect = selected === correctIdx;

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setHasSubmitted(false);
  };

  return (
    <div className={`${styles.container} ${hasSubmitted ? (isCorrect ? styles.success : styles.error) : ''}`}>
      <div className={styles.options}>
        {options.map((opt, idx) => {
          let optClass = styles.option;
          if (hasSubmitted) {
            if (idx === correctIdx) optClass += ` ${styles.correct}`;
            else if (idx === selected) optClass += ` ${styles.incorrect}`;
            else optClass += ` ${styles.disabled}`;
          } else if (selected === idx) {
            optClass += ` ${styles.selected}`;
          }

          return (
            <button 
              key={idx} 
              className={optClass}
              onClick={() => handleSelect(idx)}
              disabled={hasSubmitted}
            >
              <span className={styles.optLetter}>{String.fromCharCode(65 + idx)}</span>
              <span className={styles.optText} dangerouslySetInnerHTML={{ __html: opt }} />
              {hasSubmitted && idx === correctIdx && <span className={styles.icon}>✓</span>}
              {hasSubmitted && idx === selected && idx !== correctIdx && <span className={styles.icon}>✗</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        {!hasSubmitted ? (
          <button 
            className={styles.submitBtn} 
            disabled={selected === null}
            onClick={handleSubmit}
          >
            Kiểm tra
          </button>
        ) : (
          <button className={styles.resetBtn} onClick={handleReset}>
            Làm lại
          </button>
        )}
      </div>

      {hasSubmitted && data.explanation && (
        <div className={`${styles.explanation} ${isCorrect ? styles.expSuccess : styles.expError}`}>
          <h4>{isCorrect ? 'Tuyệt vời!' : 'Chưa chính xác!'}</h4>
          <p dangerouslySetInnerHTML={{ __html: data.explanation }} />
        </div>
      )}
    </div>
  );
}
