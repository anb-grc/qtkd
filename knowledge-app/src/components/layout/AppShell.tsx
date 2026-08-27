import { useState, useEffect } from 'react';
import { useKnowledgeBase } from '../../hooks/useKnowledgeBase';
import { useQuestionBank } from '../../hooks/useQuestionBank';
import { Mindmap } from '../blocks/Mindmap';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { ErrorBoundary } from '../common/ErrorBoundary';
import styles from './AppShell.module.css';

interface AppShellProps {
  dataPath: string;
}

export function AppShell({ dataPath }: AppShellProps) {
  const { data, loading, error } = useKnowledgeBase(dataPath);
  const { qsData } = useQuestionBank(dataPath);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  const [sheetHeight, setSheetHeight] = useState<number>(60);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (window.innerWidth > 768) return;
    setIsDragging(true);
    setStartY('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY);
    setStartHeight(sheetHeight);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const currentY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = currentY - startY;
    const vh = (deltaY / window.innerHeight) * 100;
    let newHeight = startHeight - vh;
    if (newHeight > 95) newHeight = 95;
    if (newHeight < 20) newHeight = 20;
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sheetHeight < 35) {
      setSelectedNodeId(null);
      setTimeout(() => setSheetHeight(60), 300);
    } else if (sheetHeight > 75) {
      setSheetHeight(90);
    } else {
      setSheetHeight(60);
    }
  };

  // Add mouse events to window for smooth drag outside
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleTouchMove(e as any);
    };
    const handleMouseUp = () => {
      if (isDragging) handleTouchEnd();
    };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      // Prevent scrolling while dragging
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.overflow = '';
    };
  }, [isDragging, startY, startHeight, sheetHeight]);


  // Esc key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className={styles.hubContainer}>
        <div className={styles.emptyState}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.hubContainer}>
        <div className={styles.emptyState} style={{ color: 'var(--color-danger)' }}>{error}</div>
      </div>
    );
  }

  if (!data) return null;

  useEffect(() => {
    if (selectedNodeId) setSheetHeight(60);
  }, [selectedNodeId]);


  // Find the selected node's details
  const selectedDetails = selectedNodeId 
    ? data.details?.find(d => d.node_id === selectedNodeId)
    : null;

  const handleQuizPass = (nodeId: string) => {
    if (!completedNodes.includes(nodeId)) {
      setCompletedNodes(prev => [...prev, nodeId]);
    }
  };

  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(prev => prev === id ? null : id);
  };

  return (
    <div className={styles.hubContainer}>
      <main className={styles.mainLayout}>
        {/* Left Pane: Mindmap */}
        <section className={styles.leftPane}>
          {data.overview && (
            <Mindmap 
              data={data.overview.data} 
              completedNodes={completedNodes}
              onNodeSelect={handleNodeSelect}
              selectedNodeId={selectedNodeId}
            />
          )}
        </section>

        {/* Right Pane: Side Panel */}
        <aside 
          className={`${styles.rightPane} ${!selectedDetails ? styles.hidden : ''} ${isDragging ? styles.dragging : ''}`}
          style={{ '--sheet-height': `${sheetHeight}vh` } as React.CSSProperties}
        >
          <div 
            className={styles.sidePanelHeader}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
          >
            <div className={styles.dragHandle}></div>
            <h2>Chi tiết kiến thức</h2>
            <button className={styles.closeBtn} onClick={() => setSelectedNodeId(null)}>×</button>
          </div>

          <div className={styles.sidePanelContent}>
            {selectedDetails ? (
              <div className={styles.blocksContainer}>
                {selectedDetails.components.map((block, index) => {
                  const uniqueKey = `${selectedNodeId}-${index}`;
                  // If it's a quiz, pass down the onPass prop
                  if (block.type === 'quiz') {
                    return (
                      <ErrorBoundary key={uniqueKey} fallbackTitle={block.title}>
                        <BlockRenderer 
                          block={block} 
                          index={index + 1} 
                          qsData={qsData}
                          onQuizPass={() => { if (selectedNodeId) handleQuizPass(selectedNodeId); }} 
                        />
                      </ErrorBoundary>
                    );
                  }
                  return (
                    <ErrorBoundary key={uniqueKey} fallbackTitle={block.title}>
                      <BlockRenderer block={block} index={index + 1} />
                    </ErrorBoundary>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>👆</div>
                <p>Chọn một nhánh trên sơ đồ để xem chi tiết</p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
