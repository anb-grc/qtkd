import { useState } from 'react';
import type { CarouselBlock } from '../../types/schema';
import styles from './Carousel.module.css';

export function Carousel({ data }: { data: CarouselBlock['data'] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % data.items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.items.length) % data.items.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.track} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {data.items.map((item, i) => (
          <div key={i} className={styles.slide}>
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              {item.description && <p className={styles.description}>{item.description}</p>}
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
      
      <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>❮</button>
      <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>❯</button>
      
      <div className={styles.dots}>
        {data.items.map((_, i) => (
          <button 
            key={i} 
            className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
