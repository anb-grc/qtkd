import { useState } from 'react';
import type { InteractiveCalcBlock } from '../../types/schema';
import styles from './InteractiveCalc.module.css';

export function InteractiveCalc({ data }: { data: InteractiveCalcBlock['data'] }) {
  const inputs = data.inputs || [];
  
  const initialValues: Record<string, number> = {};
  inputs.forEach(inp => {
    initialValues[inp.id] = inp.defaultValue ?? inp.min ?? 0;
  });

  const [values, setValues] = useState<Record<string, number>>(initialValues);

  const handleSliderChange = (id: string, val: number) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const computeResult = () => {
    const op = data.operation || 'add';
    const vals = inputs.map(i => {
      const v = values[i.id] ?? 0;
      return { val: v, weight: i.weight ?? 1 };
    });

    if (vals.length === 0) return 0;

    let res = 0;
    if (op === 'add') {
      res = vals.reduce((acc, curr) => acc + curr.val, 0);
    } else if (op === 'multiply') {
      res = vals.reduce((acc, curr) => acc * curr.val, 1);
    } else if (op === 'subtract') {
      res = vals.slice(1).reduce((acc, curr) => acc - curr.val, vals[0].val);
    } else if (op === 'divide') {
      res = vals.slice(1).reduce((acc, curr) => curr.val !== 0 ? acc / curr.val : acc, vals[0].val);
    } else if (op === 'weighted-sum') {
      res = vals.reduce((acc, curr) => acc + curr.val * curr.weight, 0);
    }
    return Math.round(res * 100) / 100;
  };

  const resultVal = computeResult();
  const matchedDiagnosis = data.diagnoses?.find(d => resultVal >= d.minThreshold && resultVal <= d.maxThreshold) || data.diagnoses?.[data.diagnoses.length - 1];

  return (
    <div className={styles.container}>
      {data.description && (
        <div className={styles.instruction} dangerouslySetInnerHTML={{ __html: data.description }} />
      )}
      {data.formulaLabel && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
          🧮 Công thức: {data.formulaLabel}
        </div>
      )}

      <div className={styles.calcGrid}>
        <div className={styles.controlsCol}>
          {inputs.map((inp) => (
            <div key={inp.id} className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <span className={styles.labelName}>{inp.name} ({inp.id}):</span>
                <span className={styles.labelValue}>{values[inp.id] ?? 0}{inp.unit ? ` ${inp.unit}` : ''}</span>
              </div>
              <input
                type="range"
                min={inp.min ?? 0}
                max={inp.max ?? 100}
                step={inp.step ?? 1}
                value={values[inp.id] ?? 0}
                onChange={(e) => handleSliderChange(inp.id, parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          ))}
        </div>

        <div className={styles.outputsCol}>
          <div className={styles.outHeader}>{data.resultLabel || 'Kết quả mô phỏng'}</div>
          <div className={styles.outRow} style={{ border: 'none', padding: '8px 0' }}>
            <span className={styles.outLabel}>Giá trị:</span>
            <span className={styles.outVal}>{resultVal}{data.unit ? ` ${data.unit}` : ''}</span>
          </div>

          {matchedDiagnosis && (
            <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: matchedDiagnosis.color || 'var(--color-accent-secondary)', marginBottom: '4px' }}>
                Đánh giá:
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }} dangerouslySetInnerHTML={{ __html: matchedDiagnosis.message }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
