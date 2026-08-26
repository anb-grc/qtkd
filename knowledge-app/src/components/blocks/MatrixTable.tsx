import { useState } from 'react';
import type { MatrixTableBlock } from '../../types/schema';
import styles from './Matrix.module.css';

export function MatrixTable({ data }: { data: MatrixTableBlock['data'] }) {
  const [activeRows, setActiveRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setActiveRows(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {data.headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr 
              key={i} 
              className={activeRows.includes(i) ? styles.active : ''}
              onClick={() => toggleRow(i)}
            >
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
