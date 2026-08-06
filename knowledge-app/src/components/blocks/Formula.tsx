import { useState } from 'react';
import type { FormulaBlock } from '../../types/schema';
import styles from './Formula.module.css';

export function Formula({ data }: { data: FormulaBlock['data'] }) {
  const [copied, setCopied] = useState(false);
  const [hoveredVar, setHoveredVar] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render formula with highlight support
  const renderFormula = () => {
    let result: React.ReactNode[] = [];
    const parts = data.formula
      .split(/([=+\-*/()≈><])/g)
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    parts.forEach((part, i) => {
      const isVar = data.variables.some(v => v.symbol.trim() === part);
      const isHovered = hoveredVar === part;
      
      result.push(
        <span 
          key={i} 
          className={`${styles.formulaPart} ${isVar ? styles.isVariable : ''} ${isHovered ? styles.partHovered : ''}`}
          onMouseEnter={() => isVar && setHoveredVar(part)}
          onMouseLeave={() => setHoveredVar(null)}
        >
          {part}
        </span>
      );
    });
    return result;
  };

  return (
    <div className={styles.container}>
      <div className={styles.mathWrapper}>
        <div className={styles.mathWindow}>
          <div className={styles.mathContent}>
            {renderFormula()}
          </div>
          <div className={styles.copyBtnWrapper}>
            <div className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.variablesGrid}>
        {data.variables.map((v, i) => (
          <div 
            key={i} 
            className={`${styles.varCard} ${hoveredVar === v.symbol.trim() ? styles.varHovered : ''}`}
            onMouseEnter={() => setHoveredVar(v.symbol.trim())}
            onMouseLeave={() => setHoveredVar(null)}
          >
            <div className={styles.symbolBox}>{v.symbol}</div>
            <div className={styles.def} dangerouslySetInnerHTML={{ __html: v.definition }} />
          </div>
        ))}
      </div>
      
      {(data as any).example && (
        <div className={styles.example} dangerouslySetInnerHTML={{ __html: (data as any).example }} style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }} />
      )}
    </div>
  );
}
