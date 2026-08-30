import { useState, useMemo } from 'react';
import type { QuizBlock } from '../../types/schema';
import styles from './Quiz.module.css';

interface QuizProps {
  data: QuizBlock['data'];
  onPass?: () => void;
}

export function Quiz({ data, onPass }: QuizProps) {
  // Compute pool of questions
  const pool = useMemo(() => {
    if (data.questions && data.questions.length > 0) return data.questions;
    
    // Legacy support for single question
    const qText = data.question || (data as any).q || '';
    if (qText) {
      return [{
        question: qText,
        options: data.options || (data as any).choices || [],
        correctAnswer: typeof data.correctAnswer === 'number' ? data.correctAnswer : ((data as any).answer || 0),
        explanation: data.explanation
      }];
    }
    return [];
  }, [data]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (pool.length === 0) return null;

  const currentQ = pool[currentIdx];
  const rawOptions = currentQ.options || (currentQ as any).choices || [];
  const options = rawOptions.map((opt: any) => typeof opt === 'string' ? opt : (opt.text || opt.label || opt.content || ''));
  const correctIdx = typeof currentQ.correctAnswer === 'number' ? currentQ.correctAnswer : ((currentQ as any).answer || 0);

  const isFlashcard = options.length === 0;
  // Với flashcard, không cần chọn gì cả, mặc định isCorrect là true khi show
  const isCorrect = isFlashcard ? true : (selected === correctIdx);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (!isFlashcard && selected === null) return;
    setHasSubmitted(true);
    if ((isFlashcard || selected === correctIdx) && onPass) {
      onPass();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setHasSubmitted(false);
  };

  const handleRandomize = () => {
    if (pool.length <= 1) return;
    let nextIdx = currentIdx;
    while (nextIdx === currentIdx) {
      nextIdx = Math.floor(Math.random() * pool.length);
    }
    setCurrentIdx(nextIdx);
    handleReset();
  };

  return (
    <div className={`${styles.container} ${hasSubmitted ? (isCorrect && !isFlashcard ? styles.success : (isFlashcard ? styles.flashcardDone : styles.error)) : ''}`}>
      <div className={styles.quizHeader}>
        <span className={styles.quizTitle}>{isFlashcard ? 'Câu hỏi nhanh! (Lật thẻ)' : 'Câu hỏi nhanh!'}</span>
        {pool.length > 1 && (
          <button className={styles.randomBtnTop} onClick={handleRandomize} title="Đổi câu hỏi ngẫu nhiên">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.questionText} dangerouslySetInnerHTML={{ __html: currentQ.question }} />

      {options.length > 0 && (
        <div className={styles.options}>
          {options.map((opt: string, idx: number) => {
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
                key={`${currentIdx}-${idx}`}
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
      )}

      <div className={styles.actions}>
        {!hasSubmitted ? (
          <button 
            className={styles.submitBtn} 
            disabled={!isFlashcard && selected === null}
            onClick={handleSubmit}
          >
            {isFlashcard ? 'Xem đáp án' : 'Kiểm tra'}
          </button>
        ) : (
          <button className={styles.resetBtn} onClick={handleReset}>
            Làm lại
          </button>
        )}
      </div>

      {hasSubmitted && currentQ.explanation && (
        <div className={`${styles.explanation} ${isFlashcard ? styles.expFlashcard : (isCorrect ? styles.expSuccess : styles.expError)}`}>
          <h4>{isFlashcard ? '💡 Giải thích / Đáp án:' : (isCorrect ? 'Tuyệt vời!' : 'Chưa chính xác!')}</h4>
          <p dangerouslySetInnerHTML={{ __html: currentQ.explanation }} />
        </div>
      )}
    </div>
  );
}
