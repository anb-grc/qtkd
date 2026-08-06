import { useState } from 'react';
import type { MindmapBlock, MindmapNode } from '../../types/schema';
import styles from './Mindmap.module.css';

interface Props {
  data: MindmapBlock['data'];
}

/* Ensure normalized nodes align cleanly with optically balanced fold bars and rounded center split */
function normalizeNode(node: any): MindmapNode {
  if (!node) return { label: '', description: '' };
  return {
    label: node.label || node.title || node.name || node.id || '',
    description: node.description || node.desc || node.content || node.details || '',
    children: (node.children || node.branches || node.nodes || []).map(normalizeNode)
  };
}

interface NodeProps {
  node: MindmapNode;
  isActiveLeft?: boolean;
  isActiveRight?: boolean;
  isActiveVertical?: boolean;
  isExpanded?: boolean;
  isCenterLeft?: boolean;
  isCenterRight?: boolean;
  onToggleExpand?: () => void;
  onHover?: (isHovered: boolean) => void;
}

function Node({ node: rawNode, isActiveLeft, isActiveRight, isActiveVertical, isExpanded, isCenterLeft, isCenterRight, onToggleExpand, onHover }: NodeProps) {
  const [expandedChildIdx, setExpandedChildIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const node = normalizeNode(rawNode);

  const numChildren = node.children?.length || 0;
  const C = (numChildren - 1) / 2;

  return (
    <div 
      className={`${styles.nodeWrapper} ${isExpanded ? styles.wrapperExpanded : ''} ${isCenterLeft ? styles.centerLeftChild : ''} ${isCenterRight ? styles.centerRightChild : ''}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div className={`${styles.connectorLeft} ${isActiveLeft ? styles.active : ''}`} />
      <div className={`${styles.connectorRight} ${isActiveRight ? styles.active : ''}`} />
      <div className={`${styles.verticalDrop} ${isActiveVertical ? styles.active : ''}`} />
      
      <div className={`${styles.node} ${isExpanded ? styles.nodeExpanded : ''}`} onClick={() => node.description && onToggleExpand?.()} style={{ cursor: node.description ? 'pointer' : 'default' }}>
        <span className={styles.nodeText} dangerouslySetInnerHTML={{ __html: node.label }} />
        {node.description && (
          <span className={`${styles.expandIcon} ${isExpanded ? styles.expandedIcon : ''}`}>▼</span>
        )}
      </div>
      {node.description && (
        <div className={`${styles.descSpacer} ${isExpanded ? styles.spacerExpanded : ''}`}>
          <div className={`${styles.nodeDescription} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: node.description }} />
          </div>
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div className={`${styles.children} ${(hoveredIdx !== null || expandedChildIdx !== null) ? styles.hasHover : ''} ${numChildren % 2 === 0 ? styles.curvedStem : styles.straightStem}`}>
          {node.children.map((child, idx) => {
            let childActiveLeft = false;
            let childActiveRight = false;
            let childActiveVertical = false;

            const checkActive = (targetIdx: number | null) => {
              if (targetIdx === null) return;
              const H = targetIdx;
              if (H < C) {
                if (H < idx && idx <= Math.floor(C)) childActiveLeft = true;
                if (H <= idx && idx < Math.ceil(C)) childActiveRight = true;
              } else if (H > C) {
                if (Math.floor(C) < idx && idx <= H) childActiveLeft = true;
                if (Math.ceil(C) <= idx && idx < H) childActiveRight = true;
              }
              if (idx === H) {
                childActiveVertical = true;
              }
            };

            checkActive(hoveredIdx);
            checkActive(expandedChildIdx);

            const isChildCenterLeft = numChildren % 2 === 0 && idx === Math.floor(C);
            const isChildCenterRight = numChildren % 2 === 0 && idx === Math.ceil(C);

            return (
              <Node 
                key={idx} 
                node={child} 
                isActiveLeft={childActiveLeft}
                isActiveRight={childActiveRight}
                isActiveVertical={childActiveVertical}
                isExpanded={expandedChildIdx === idx}
                isCenterLeft={isChildCenterLeft}
                isCenterRight={isChildCenterRight}
                onToggleExpand={() => setExpandedChildIdx(expandedChildIdx === idx ? null : idx)}
                onHover={(isHovered) => setHoveredIdx(isHovered ? idx : null)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Mindmap({ data }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const rootText = data.root || (data as any).title || (data as any).name || '';
  const rawChildren = data.children || (data as any).branches || (data as any).nodes || [];
  const children: MindmapNode[] = rawChildren.map(normalizeNode);

  const numChildren = children.length;
  const C = (numChildren - 1) / 2;

  return (
    <div className={styles.container}>
      <div className={styles.rootWrapper}>
        <div className={styles.rootNode}>
          <span className={styles.nodeText} dangerouslySetInnerHTML={{ __html: rootText }} />
        </div>
        {children && children.length > 0 && (
          <div className={`${styles.children} ${(hoveredIdx !== null || expandedIdx !== null) ? styles.hasHover : ''}`}>
            {children.map((child, idx) => {
              let isActiveLeft = false;
              let isActiveRight = false;
              let isActiveVertical = false;

              const checkActive = (targetIdx: number | null) => {
                if (targetIdx === null) return;
                const H = targetIdx;
                if (H < C) {
                  if (H < idx && idx <= Math.floor(C)) isActiveLeft = true;
                  if (H <= idx && idx < Math.ceil(C)) isActiveRight = true;
                } else if (H > C) {
                  if (Math.floor(C) < idx && idx <= H) isActiveLeft = true;
                  if (Math.ceil(C) <= idx && idx < H) isActiveRight = true;
                }
                if (idx === H) {
                  isActiveVertical = true;
                }
              };

              checkActive(hoveredIdx);
              checkActive(expandedIdx);

              return (
                <Node 
                  key={idx} 
                  node={child} 
                  isActiveLeft={isActiveLeft}
                  isActiveRight={isActiveRight}
                  isActiveVertical={isActiveVertical}
                  isExpanded={expandedIdx === idx}
                  onToggleExpand={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  onHover={(isHovered) => setHoveredIdx(isHovered ? idx : null)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
