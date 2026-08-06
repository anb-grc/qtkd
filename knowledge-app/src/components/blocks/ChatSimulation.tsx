import { useState } from 'react';
import type { ChatSimulationBlock } from '../../types/schema';
import styles from './ChatSimulation.module.css';

export function ChatSimulation({ data }: { data: ChatSimulationBlock['data'] }) {
  const messages = data.messages || [];
  const [step, setStep] = useState<number>(Math.min(2, messages.length));

  if (messages.length === 0) return null;

  const visibleMessages = messages.slice(0, step);
  const isAllShown = step >= messages.length;

  const handleNext = () => {
    if (!isAllShown) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(Math.min(2, messages.length));
  };

  return (
    <div className={styles.container}>
      {data.scenario && (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: 'var(--space-xs)' }}>
          {data.scenario}
        </div>
      )}

      <div className={styles.chatBox}>
        {visibleMessages.map((msg, idx) => {
          const firstSender = messages[0]?.sender;
          const isRight =
            msg.role === 'student' ||
            msg.role === 'advisor' ||
            msg.sender.toLowerCase().includes('sinh') ||
            msg.sender.toLowerCase().includes('user') ||
            msg.sender.toLowerCase().includes('bạn') ||
            msg.sender.toLowerCase().includes('cố vấn') ||
            (idx > 0 && msg.sender !== firstSender);
          const isTrap = msg.isTrap;

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div className={`${styles.messageRow} ${isRight ? styles.rowRight : styles.rowLeft}`}>
                <span className={styles.senderLabel}>
                  {msg.sender}{msg.role ? ` (${msg.role})` : ''}
                </span>
                <div
                  className={`${styles.bubble} ${isRight ? styles.bubbleRight : styles.bubbleLeft}`}
                  style={{
                    border: isTrap ? '1px solid var(--color-danger, #ff4757)' : undefined,
                    background: msg.highlight ? 'rgba(0, 206, 201, 0.15)' : undefined,
                    color: msg.highlight && !isRight ? '#ffffff' : undefined,
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>

              {msg.note && (
                <div
                  style={{
                    alignSelf: isRight ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '8px 14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    fontSize: 'var(--text-xs)',
                    color: isTrap ? 'var(--color-danger, #ff4757)' : 'var(--color-accent-secondary, #00cec9)',
                    lineHeight: 1.5,
                  }}
                  dangerouslySetInnerHTML={{ __html: `Ghi chú: ${msg.note}` }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center', marginTop: 'var(--space-sm)' }}>
        {!isAllShown && (
          <button
            onClick={handleNext}
            className={styles.nextBtn}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Tiếp tục hội thoại ({step}/{messages.length})
          </button>
        )}
        {step > 1 && (
          <button className={styles.resetBtn} style={{ whiteSpace: 'nowrap', flexShrink: 0 }} onClick={handleReset}>
            Làm lại tình huống
          </button>
        )}
      </div>
    </div>
  );
}
