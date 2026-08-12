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
      <header className={styles.header}>
        <h1 className={styles.title}>{data.subject}</h1>
      </header>

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
        <aside className={`${styles.rightPane} ${!selectedDetails ? styles.hidden : ''}`}>
          <div className={styles.sidePanelHeader}>
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
