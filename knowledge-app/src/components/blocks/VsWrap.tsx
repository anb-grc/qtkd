import { useState } from 'react';
import type { VsWrapBlock } from '../../types/schema';
import styles from './VsWrap.module.css';

export function VsWrap({ data }: { data: VsWrapBlock['data'] }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const left = data.left ? {
    title: data.left.title || '',
    content: data.left.content || (data.left as any).description || (Array.isArray((data.left as any).points) ? (data.left as any).points.join('<br/>') : '')
  } : {
    title: (data as any).col1_title || (data as any).left_title || '',
    content: (data as any).col1_desc || (data as any).col1_content || ''
  };

  const right = data.right ? {
    title: data.right.title || '',
    content: data.right.content || (data.right as any).description || (Array.isArray((data.right as any).points) ? (data.right as any).points.join('<br/>') : '')
  } : {
    title: (data as any).col2_title || (data as any).right_title || '',
    content: (data as any).col2_desc || (data as any).right_content || ''
  };

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.side} ${styles.leftSide} ${leftOpen ? styles.open : ''}`}
        onClick={() => setLeftOpen(!leftOpen)}
      >
        <div className={styles.header}>
          <h4 className={styles.title}>{left.title}</h4>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: left.content }} />
        </div>
        <div className={styles.chevron}>{leftOpen ? '▲' : '▼'}</div>
      </div>
      
      <div className={styles.dividerWrapper}>
        <div className={styles.divider}>VS</div>
        <div className={styles.pulse}></div>
      </div>
      
      <div 
        className={`${styles.side} ${styles.rightSide} ${rightOpen ? styles.open : ''}`}
        onClick={() => setRightOpen(!rightOpen)}
      >
        <div className={styles.header}>
          <h4 className={styles.title}>{right.title}</h4>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: right.content }} />
        </div>
        <div className={styles.chevron}>{rightOpen ? '▲' : '▼'}</div>
      </div>
    </div>
  );
}
