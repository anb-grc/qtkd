import { useState } from 'react';
import type { TAccountBlock } from '../../types/schema';
import styles from './TAccount.module.css';

export function TAccount({ data }: { data: TAccountBlock['data'] }) {
  const [expanded, setExpanded] = useState(false);

  const leftHeader = data.left?.header || (data as any).left_title || '';
  const leftEntries: string[] = data.left?.entries || (Array.isArray((data as any).left_content) ? (data as any).left_content : [(data as any).left_content || '']);
  const rightHeader = data.right?.header || (data as any).right_title || '';
  const rightEntries: string[] = data.right?.entries || (Array.isArray((data as any).right_content) ? (data as any).right_content : [(data as any).right_content || '']);

  const maxEntries = Math.max(leftEntries.length, rightEntries.length);
  const isLong = maxEntries > 3;

  const displayLeft = (isLong && !expanded) ? leftEntries.slice(0, 3) : leftEntries;
  const displayRight = (isLong && !expanded) ? rightEntries.slice(0, 3) : rightEntries;

  return (
    <div className={styles.container}>
      <div className={styles.tShape}>
        <div className={styles.tHeader}>
          <div className={styles.sideHeader}>{leftHeader}</div>
          <div className={styles.divider}></div>
          <div className={styles.sideHeader}>{rightHeader}</div>
        </div>
        <div className={styles.tBody}>
          <div className={styles.sideBody}>
            <ul>{displayLeft.map((e,i) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className={styles.dividerMain}></div>
          <div className={styles.sideBody}>
            <ul>{displayRight.map((e,i) => <li key={i}>{e}</li>)}</ul>
          </div>
        </div>
        {isLong && (
          <div className={styles.toggleWrapper} onClick={() => setExpanded(!expanded)}>
            <span className={styles.toggleBtn}>
              {expanded ? '▲ Thu gọn' : `▼ Xem thêm (${maxEntries - 3} ý)`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
