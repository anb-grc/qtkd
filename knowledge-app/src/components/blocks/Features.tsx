import type { FeaturesBlock } from '../../types/schema';
import styles from './Features.module.css';

export function Features({ data }: { data: FeaturesBlock['data'] }) {
  return (
    <div className={styles.container}>
      {data.items.map((item, i) => (
        <div key={i} className={styles.item}>
          
          <div className={styles.content}>
            <h4 className={styles.title}>{item.title}</h4>
            {item.description && <div className={styles.description}>{item.description}</div>}
            {(item as any).content && <div className={styles.description} dangerouslySetInnerHTML={{ __html: (item as any).content }} />}
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
