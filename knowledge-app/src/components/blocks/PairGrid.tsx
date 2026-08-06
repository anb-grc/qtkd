import { useState, useEffect, useRef } from 'react';
import type { PairGridBlock } from '../../types/schema';
import styles from './PairGrid.module.css';

interface LineCoord {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function PairGrid({ data }: { data: PairGridBlock['data'] }) {
  const pairs = data.pairs || [];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [lines, setLines] = useState<LineCoord[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  if (pairs.length === 0) return null;

  const leftItems = pairs.map((p) => ({ id: p.id, text: p.leftText, pairId: p.id, explanation: p.explanation }));
  // Stable shuffled ordering for right items by reverse mapping
  const rightItems = [...pairs].reverse().map((p) => ({ id: `${p.id}_r`, text: p.rightText, pairId: p.id }));

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeft(id === selectedLeft ? null : id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    setSelectedRight(pairId === selectedRight ? null : pairId);
    if (selectedLeft) {
      checkMatch(selectedLeft, pairId);
    }
  };

  const checkMatch = (leftPairId: string, rightPairId: string) => {
    if (leftPairId === rightPairId) {
      setMatchedIds([...matchedIds, leftPairId]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setErrorId(`${leftPairId}-${rightPairId}`);
      setTimeout(() => {
        setErrorId(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  };

  const resetGame = () => {
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  useEffect(() => {
    const updateLines = () => {
      if (!boardRef.current || matchedIds.length === 0) {
        setLines([]);
        return;
      }
      const boardEl = boardRef.current;
      const boardBox = boardEl.getBoundingClientRect();
      const newLines: LineCoord[] = [];

      matchedIds.forEach((pairId) => {
        const leftBtn = boardEl.querySelector(`[data-left-id="${pairId}"]`) as HTMLElement | null;
        const rightBtn = boardEl.querySelector(`[data-right-id="${pairId}"]`) as HTMLElement | null;

        if (leftBtn && rightBtn) {
          const leftBox = leftBtn.getBoundingClientRect();
          const rightBox = rightBtn.getBoundingClientRect();

          const x1 = leftBox.right - boardBox.left;
          const y1 = leftBox.top + leftBox.height / 2 - boardBox.top;
          const x2 = rightBox.left - boardBox.left;
          const y2 = rightBox.top + rightBox.height / 2 - boardBox.top;

          newLines.push({ id: pairId, x1, y1, x2, y2 });
        }
      });

      setLines(newLines);
    };

    updateLines();

    window.addEventListener('resize', updateLines);
    let observer: ResizeObserver | null = null;
    if (boardRef.current) {
      observer = new ResizeObserver(() => updateLines());
      observer.observe(boardRef.current);
    }

    const timer = setTimeout(updateLines, 50);

    return () => {
      window.removeEventListener('resize', updateLines);
      if (observer) observer.disconnect();
      clearTimeout(timer);
    };
  }, [matchedIds, leftItems.length, rightItems.length]);

  return (
    <div className={styles.container}>
      {data.instruction && (
        <div className={styles.instruction} dangerouslySetInnerHTML={{ __html: data.instruction }} />
      )}

      <div className={styles.board} ref={boardRef} style={{ position: 'relative' }}>
        {lines.length > 0 && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10,
              overflow: 'visible',
            }}
          >
            <defs>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffbe0b" floodOpacity="0.85" />
              </filter>
            </defs>
            {lines.map((line) => {
              const dx = (line.x2 - line.x1) * 0.5;
              const d = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;
              return (
                <g key={line.id} filter="url(#goldGlow)">
                  <path
                    d={d}
                    stroke="#ffbe0b"
                    strokeWidth="1.5"
                    fill="none"
                    style={{ transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />
                  <circle cx={line.x1} cy={line.y1} r="3" fill="#ffbe0b" />
                  <circle cx={line.x2} cy={line.y2} r="3" fill="#ffbe0b" />
                </g>
              );
            })}
          </svg>
        )}

        <div className={styles.column}>
          <div className={styles.colHeader}>Vế Trái (Mỏ Neo / Câu Hỏi)</div>
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.pairId);
            const isSel = selectedLeft === item.pairId;
            const isErr = errorId?.startsWith(`${item.pairId}-`);

            return (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  data-left-id={item.pairId}
                  className={`${styles.itemCard} ${isMatched ? styles.matched : ''} ${isSel ? styles.selected : ''} ${isErr ? styles.errorFlash : ''}`}
                  onClick={() => handleLeftClick(item.pairId)}
                  disabled={isMatched}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.text }} />
                </button>
                {isMatched && item.explanation && (
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-accent-secondary)',
                      background: 'rgba(0, 206, 201, 0.08)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 206, 201, 0.2)',
                    }}
                    dangerouslySetInnerHTML={{ __html: item.explanation }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.column}>
          <div className={styles.colHeader}>Vế Phải (Đối Chiếu / Đáp Án)</div>
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.pairId);
            const isSel = selectedRight === item.pairId;
            const isErr = errorId?.endsWith(`-${item.pairId}`);

            return (
              <button
                key={item.id}
                data-right-id={item.pairId}
                className={`${styles.itemCard} ${isMatched ? styles.matched : ''} ${isSel ? styles.selected : ''} ${isErr ? styles.errorFlash : ''}`}
                onClick={() => handleRightClick(item.pairId)}
                disabled={isMatched}
              >
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </button>
            );
          })}
        </div>
      </div>

      {matchedIds.length > 0 && (
        <button className={styles.resetBtn} onClick={resetGame}>
          {matchedIds.length === pairs.length ? 'Hoàn tất ghép nối! Chơi lại' : 'Xóa ghép nối & làm lại'}
        </button>
      )}
    </div>
  );
}
