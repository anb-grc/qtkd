import { useState } from 'react';
import type { VennBlock, VennDiagramBlock } from '../../types/schema';
import styles from './Venn.module.css';

export function Venn({ data }: { data: VennBlock['data'] | VennDiagramBlock['data'] }) {
  const [showOverlap, setShowOverlap] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.circle} ${styles.left}`}>
        <h4 className={styles.title}>{data.left.title}</h4>
        {data.left.items && (
          <ul className={styles.list}>
            {data.left.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={`${styles.circle} ${styles.right}`}>
        <h4 className={styles.title}>{data.right.title}</h4>
        {data.right.items && (
          <ul className={styles.list}>
            {data.right.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div 
        className={`${styles.overlap} ${showOverlap ? styles.active : ''}`}
        onClick={() => setShowOverlap(!showOverlap)}
      >
        <div className={styles.overlapHint}>
          Chạm để xem điểm chung
        </div>
        <div className={styles.overlapContent}>
          {data.intersection && <div dangerouslySetInnerHTML={{ __html: data.intersection }} />}
          {(data as any).intersection_items && (
            <ul className={styles.list} style={{ textAlign: 'left', marginTop: '5px' }}>
              {(data as any).intersection_items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
