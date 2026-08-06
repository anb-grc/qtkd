import { useState } from 'react';
import type { DecisionTreeBlock } from '../../types/schema';
import styles from './DecisionTree.module.css';

export function DecisionTree({ data }: { data: DecisionTreeBlock['data'] }) {
  const startId = data.startNodeId;
  const nodes = data.nodes || {};

  const [path, setPath] = useState<string[]>([startId]);

  if (!startId || !nodes[startId]) return null;

  const currentId = path[path.length - 1];
  const currentNode = nodes[currentId] || nodes[startId];

  const handleSelectOption = (nextId: string) => {
    if (nodes[nextId]) {
      setPath([...path, nextId]);
    }
  };

  const handleReset = () => {
    setPath([startId]);
  };

  return (
    <div className={styles.container}>
      {path.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <span>Lộ trình:</span>
          {path.map((id, idx) => (
            <span key={idx} style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>
              {nodes[id]?.label || id}{idx < path.length - 1 ? ' ➔' : ''}
            </span>
          ))}
        </div>
      )}

      <div className={`${styles.nodeBox} ${currentNode.isTrap ? styles.trapBox : ''}`} style={{ border: currentNode.outcome ? '1px solid var(--color-success, #2ed573)' : undefined }}>
        <div className={styles.nodeTitle}>
          {currentNode.isTrap ? 'Bẫy đề: ' : (currentNode.outcome ? 'Kết luận: ' : '')}
          {currentNode.label}
        </div>

        {currentNode.question && (
          <div className={styles.nodeQuestion} dangerouslySetInnerHTML={{ __html: currentNode.question }} />
        )}

        {currentNode.outcome && (
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-success, #2ed573)', marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: currentNode.outcome }} />
        )}

        {currentNode.explanation && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }} dangerouslySetInnerHTML={{ __html: currentNode.explanation }} />
        )}
      </div>

      {currentNode.options && currentNode.options.length > 0 && (
        <div className={styles.optionsList}>
          {currentNode.options.map((opt, idx) => (
            <button
              key={idx}
              className={styles.optionBtn}
              onClick={() => handleSelectOption(opt.nextNodeId)}
            >
              <span>{opt.text}</span>
              {opt.tag && (
                <span style={{
                  alignSelf: 'center',
                  margin: '2px auto 0 auto',
                  textAlign: 'center',
                  fontSize: '11px',
                  background: opt.tag === 'Nguy hiểm' ? 'rgba(255, 71, 87, 0.15)' : 'rgba(46, 213, 115, 0.15)',
                  color: opt.tag === 'Nguy hiểm' ? 'var(--color-danger, #ff4757)' : 'var(--color-success, #2ed573)',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  {opt.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {(path.length > 1 || !currentNode.options || currentNode.options.length === 0) && (
        <button className={styles.resetBtn} onClick={handleReset}>
          Bắt đầu phân tích lại từ đầu
        </button>
      )}
    </div>
  );
}
