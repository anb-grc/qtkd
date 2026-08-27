import type { TimelineBlock } from '../../types/schema';
import styles from './Timeline.module.css';

export function Timeline({ data }: { data: TimelineBlock['data'] }) {
  return (
    <div className={styles.container}>
      {data.items.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.time}>{item.time}</div>
          <div className={styles.content}>
            {(item as any).title && <div className={styles.title}><strong>{(item as any).title}</strong></div>}
            {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}
            {(item as any).description && <div className={styles.desc}>{(item as any).description}</div>}
            {(item as any).points && Array.isArray((item as any).points) && (
              <ul className="kb-points-list">
                {(item as any).points.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
