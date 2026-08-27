import { useState } from 'react';
import type { VsWrapBlock } from '../../types/schema';
import styles from './VsWrap.module.css';

export function VsWrap({ data }: { data: VsWrapBlock['data'] }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const parseSide = (sideData: any) => {
    if(!sideData) return { title: '', desc: '', pts: [], kws: [], content: '' };
    return {
      title: sideData.title || '',
      desc: sideData.description || '',
      pts: Array.isArray(sideData.points) ? sideData.points : [],
      kws: Array.isArray(sideData.keywords) ? sideData.keywords : [],
      content: sideData.content || ''
    };
  };

  const left = data.left ? parseSide(data.left) : parseSide({ title: (data as any).col1_title, content: (data as any).col1_desc });
  const right = data.right ? parseSide(data.right) : parseSide({ title: (data as any).col2_title, content: (data as any).col2_desc });

  const renderSideContent = (side: any) => (
    <>
      {side.desc && <div className={styles.desc}>{side.desc}</div>}
      {side.pts.length > 0 && (
        <ul className="kb-points-list">
          {side.pts.map((p: string, i: number) => <li key={i}>{p}</li>)}
        </ul>
      )}
      {side.content && <div className={styles.content} dangerouslySetInnerHTML={{ __html: side.content }} />}
      {side.kws.length > 0 && (
        <div className={styles.keywords}>
          {side.kws.map((k: string, i: number) => <span key={i} className="kb-keyword-badge">{k}</span>)}
        </div>
      )}
    </>
  );

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
          {renderSideContent(left)}
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
          {renderSideContent(right)}
        </div>
        <div className={styles.chevron}>{rightOpen ? '▲' : '▼'}</div>
      </div>
    </div>
  );
}
