import type { QuadrantBlock } from '../../types/schema';
import styles from './Quadrant.module.css';

export function Quadrant({ data }: { data: QuadrantBlock['data'] }) {
  const { x_axis, y_axis, quadrants } = data;

  const renderQuadContent = (q: any) => {
    if (!q) return null;
    const pts = Array.isArray(q.points) ? q.points : [];
    return (
      <div className={styles.quadContentWrap}>
        {q.description && <div className={styles.desc}>{q.description}</div>}
        {pts.length > 0 && (
          <ul className="kb-points-list">
            {pts.map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {q.content && <div className={styles.content} dangerouslySetInnerHTML={{ __html: q.content }} />}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {y_axis && <div className={styles.yAxis}>{y_axis}</div>}
        
        <div className={styles.grid}>
          {quadrants.map((q, i) => (
            <div key={i} className={`${styles.quadrant} ${styles[`q${i + 1}`]}`}>
              <h4 className={styles.title}>{q.title}</h4>
              {renderQuadContent(q)}
            </div>
          ))}
        </div>
      </div>
      {x_axis && <div className={styles.xAxis}>{x_axis}</div>}
    </div>
  );
}
