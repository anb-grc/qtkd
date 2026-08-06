import type { DeltaCheatSheetBlock } from '../../types/schema';
import styles from './DeltaCheatSheet.module.css';

export function DeltaCheatSheet({ data }: { data: DeltaCheatSheetBlock['data'] }) {
  const items = data.items || [];

  if (items.length === 0) return null;

  return (
    <div className={styles.container}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.itemCard}>
          <div className={styles.sideBox}>
            {item.category && (
              <div className={styles.categoryBadge}>
                {item.category}
              </div>
            )}
            <div className={styles.sideLabel} dangerouslySetInnerHTML={{ __html: item.questionSnippet }} />
            {item.keyword && (
              <div className={styles.keywordWrapper}>
                Keyword: <span className={styles.keywordHighlight}>{item.keyword}</span>
              </div>
            )}
          </div>

          <div className={styles.deltaBox}>
            {item.correctDelta && (
              <div className={styles.correctItem}>
                <span className={styles.iconCorrect}>✓</span>
                <span dangerouslySetInnerHTML={{ __html: item.correctDelta }} />
              </div>
            )}
            {item.wrongTraps && item.wrongTraps.length > 0 && (
              <div className={styles.wrongList}>
                {item.wrongTraps.map((t, i) => (
                  <div key={i} className={styles.wrongItem}>
                    <span className={styles.iconWrong}>✗</span>
                    <span dangerouslySetInnerHTML={{ __html: t }} />
                  </div>
                ))}
              </div>
            )}
            {item.explanation && (
              <div className={styles.explanation} dangerouslySetInnerHTML={{ __html: item.explanation }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
