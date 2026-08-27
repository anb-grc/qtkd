import { useState } from 'react';
import type { VsWrapBlock } from '../../types/schema';
import styles from './VsWrap.module.css';

export function VsWrap({ data }: { data: VsWrapBlock['data'] }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  
  const renderSideContent = (sideData: any) => {
    if(!sideData) return null;
    const desc = sideData.description || sideData.desc;
    const content = sideData.content || (Array.isArray(sideData.points) ? sideData.points.join('<br/>') : '');
    const pts = Array.isArray(sideData.points) ? sideData.points : [];
    const kws = Array.isArray(sideData.keywords) ? sideData.keywords : [];
    
    // If it has new structure:
    if(desc || pts.length > 0 || kws.length > 0) {
      return (
        <>
          {desc && <div className={styles.content} style={{opacity: 0.8, fontStyle: 'italic', marginBottom: '8px'}}>{desc}</div>}
          {pts.length > 0 && (
            <ul className="kb-points-list">
              {pts.map((p: string, i: number) => <li key={i}>{p}</li>)}
            </ul>
          )}
          {kws.length > 0 && (
            <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'12px'}}>
              {kws.map((k: string, i: number) => <span key={i} className="kb-keyword-badge">{k}</span>)}
            </div>
          )}
          {sideData.content && <div className={styles.content} dangerouslySetInnerHTML={{ __html: sideData.content }} />}
        </>
      );
    }
    
    // Legacy fallback
    return <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const left = data.left || { title: (data as any).col1_title, content: (data as any).col1_desc };
  const right = data.right || { title: (data as any).col2_title, content: (data as any).col2_desc };

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
