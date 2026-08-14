import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import type { MindmapBlock, MindmapNode } from '../../types/schema';
import styles from './Mindmap.module.css';

interface Props {
  data: MindmapBlock['data'];
  completedNodes?: string[];
  onNodeSelect?: (id: string) => void;
  selectedNodeId?: string | null;
}

function normalizeNode(node: any): MindmapNode {
  if (!node) return { label: '', description: '' };
  return {
    id: node.id || '',
    label: node.label || node.title || node.name || node.id || '',
    description: node.description || node.desc || node.content || node.details || '',
    children: (node.children || node.branches || node.nodes || []).map(normalizeNode)
  };
}

function isNodeInTree(node: MindmapNode, targetId: string | null): boolean {
  if (!targetId) return false;
  if (node.id === targetId) return true;
  return node.children?.some(child => isNodeInTree(child, targetId)) || false;
}

function getRelativeOffset(element: HTMLElement, container: HTMLElement) {
  let top = 0;
  let left = 0;
  let curr: HTMLElement | null = element;
  while (curr && curr !== container) {
    top += curr.offsetTop;
    left += curr.offsetLeft;
    curr = curr.offsetParent as HTMLElement;
  }
  return { top, left };
}

// SVG connector overlay: draws Bézier curves from parentRef bottom-center to each childRef top-center
function SvgConnectors({
  parentRef,
  childRefs,
  activeIdx,
  containerRef,
}: {
  parentRef: React.RefObject<HTMLDivElement | null>;
  childRefs: React.RefObject<HTMLDivElement | null>[];
  activeIdx: number | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [paths, setPaths] = useState<{ d: string; active: boolean }[]>([]);
  const [svgBox, setSvgBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const recalc = useCallback(() => {
    const container = containerRef.current;
    const parent = parentRef.current;
    if (!container || !parent) return;

    // SVG covers the entire scrollable area of the container
    const newBox = { left: 0, top: 0, width: container.scrollWidth, height: container.scrollHeight };

    // Get exact center-bottom of parent using stable local layout coordinates
    const pOffset = getRelativeOffset(parent, container);
    const px = pOffset.left + parent.offsetWidth / 2;
    const py = pOffset.top + parent.offsetHeight;

    const newPaths = childRefs.map((ref, idx) => {
      const el = ref.current;
      if (!el) return { d: '', active: false };
      
      const cOffset = getRelativeOffset(el, container);
      const cx = cOffset.left + el.offsetWidth / 2;
      const cy = cOffset.top;

      // Cubic Bézier: control points at midpoint y
      const midY = (py + cy) / 2;
      const d = `M ${px} ${py} C ${px} ${midY}, ${cx} ${midY}, ${cx} ${cy}`;
      return { d, active: idx === activeIdx };
    });

    setSvgBox(newBox);
    setPaths(newPaths);
  }, [parentRef, childRefs, activeIdx, containerRef]);

  useEffect(() => {
    // Recalc after paint
    const frame = requestAnimationFrame(() => recalc());
    return () => cancelAnimationFrame(frame);
  }, [recalc]);

  // Also recalc on resize of container, parent, or any child
  useEffect(() => {
    const obs = new ResizeObserver(() => recalc());
    if (containerRef.current) obs.observe(containerRef.current);
    if (parentRef.current) obs.observe(parentRef.current);
    childRefs.forEach(ref => {
      if (ref.current) obs.observe(ref.current);
    });
    return () => obs.disconnect();
  }, [containerRef, parentRef, childRefs, recalc]);

  if (!paths.length || !containerRef.current) return null;

  return createPortal(
    <svg
      className={styles.svgOverlay}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: svgBox.width,
        height: svgBox.height,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
    >
      {paths.map((p, i) =>
        p.d ? (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.active ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}
            strokeWidth={p.active ? 2.5 : 1.8}
            strokeOpacity={p.active ? 1 : 0.55}
            style={{ transition: 'stroke 0.25s ease, stroke-opacity 0.25s ease' }}
          />
        ) : null
      )}
    </svg>,
    containerRef.current
  );
}

interface NodeProps {
  node: MindmapNode;
  activeIdx?: number | null;     // which child is hovered/expanded
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onHover?: (isHovered: boolean) => void;
  onSelect?: (id: string) => void;
  isCompleted?: boolean;
  completedNodes?: string[];
  selectedNodeId?: string | null;
  // container ref for SVG coordinate system
  rootContainerRef: React.RefObject<HTMLDivElement | null>;
}

function Node({ node: rawNode, isExpanded, onToggleExpand, onHover, onSelect, isCompleted, completedNodes, selectedNodeId, rootContainerRef }: NodeProps) {
  const [expandedChildIdx, setExpandedChildIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const node = normalizeNode(rawNode);
  const numChildren = node.children?.length || 0;

  // Refs for SVG drawing
  const selfNodeRef = useRef<HTMLDivElement>(null);
  const childNodeRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);
  if (childNodeRefs.current.length !== numChildren) {
    childNodeRefs.current = Array.from({ length: numChildren }, () => ({ current: null }));
  }

  let selectedChildIdx: number | null = null;
  if (selectedNodeId && node.children) {
    const idx = node.children.findIndex(child => isNodeInTree(child, selectedNodeId));
    if (idx !== -1) selectedChildIdx = idx;
  }

  const currentActiveIdx = hoveredIdx !== null ? hoveredIdx : (selectedChildIdx !== null ? selectedChildIdx : expandedChildIdx);

  return (
    <div
      className={`${styles.nodeWrapper} ${isExpanded ? styles.wrapperExpanded : ''}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div
        ref={selfNodeRef}
        className={`${styles.node} ${isExpanded ? styles.nodeExpanded : ''} ${isCompleted ? styles.nodeCompleted : ''} ${selectedNodeId === node.id ? styles.nodeSelected : ''} ${(hoveredIdx !== null || selectedChildIdx !== null) ? styles.nodeActiveLine : ''}`}
        onClick={() => {
          if (node.id && onSelect) onSelect(node.id);
          if (node.description || node.children?.length) onToggleExpand?.();
        }}
        style={{ cursor: 'pointer' }}
      >
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

      {numChildren > 0 && (
        <div className={styles.childrenSvg}>
          {/* SVG layer draws all lines from selfNodeRef → each childRef */}
          <SvgConnectors
            parentRef={selfNodeRef}
            childRefs={childNodeRefs.current}
            activeIdx={currentActiveIdx}
            containerRef={rootContainerRef}
          />

          {node.children!.map((child, idx) => (
            <div
              key={idx}
              ref={(el) => { childNodeRefs.current[idx].current = el; }}
              className={styles.childSlot}
            >
              <Node
                node={child}
                activeIdx={null}
                isExpanded={expandedChildIdx === idx}
                rootContainerRef={rootContainerRef}
                onToggleExpand={() => setExpandedChildIdx(expandedChildIdx === idx ? null : idx)}
                onHover={(isHovered) => setHoveredIdx(isHovered ? idx : null)}
                onSelect={onSelect}
                isCompleted={child.id ? completedNodes?.includes(child.id) : false}
                completedNodes={completedNodes}
                selectedNodeId={selectedNodeId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MindmapZoomControls({ rootWrapperRef, containerRef, expandedIdx }: { rootWrapperRef: React.RefObject<HTMLDivElement | null>, containerRef: React.RefObject<HTMLDivElement | null>, expandedIdx: number | null }) {
  const { zoomIn, zoomOut, setTransform } = useControls();
  const hasAutoFit = useRef(false);

  const doAutoFit = useCallback(() => {
    const wrapper = rootWrapperRef.current;
    if (!wrapper) return;
    const container = containerRef.current;
    if (!container) return;

    const contentWidth = wrapper.scrollWidth;
    const contentHeight = wrapper.scrollHeight;
    
    const viewportWidth = container.clientWidth;
    const viewportHeight = container.clientHeight;

    const scaleX = viewportWidth / contentWidth;
    const scaleY = viewportHeight / contentHeight;
    let scale = Math.min(scaleX, scaleY) * 0.95;
    if (scale > 1) scale = 1;

    // Đẩy lên sát lề trên (y = 0)
    const x = (viewportWidth - contentWidth * scale) / 2;
    const y = 0; // Đẩy khung vẽ chạm nóc

    setTransform(x, y, scale, 300);
  }, [rootWrapperRef, setTransform]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (!hasAutoFit.current && container.clientWidth > 0 && container.clientHeight > 0) {
        setTimeout(() => {
          doAutoFit();
          hasAutoFit.current = true;
        }, 50);
      }
    });
    observer.observe(container);

    if (!hasAutoFit.current && container.clientWidth > 0 && container.clientHeight > 0) {
      setTimeout(() => {
        doAutoFit();
        hasAutoFit.current = true;
      }, 50);
    }

    return () => observer.disconnect();
  }, [doAutoFit]);

  // Đã bỏ tính năng cập nhật height qua JS
  useEffect(() => {
    // Không làm gì thêm, để CSS lo
  }, [expandedIdx]);

  return (
    <div className={styles.zoomControls}>
      <button className={styles.zoomBtn} onClick={() => zoomIn(0.2)}>+</button>
      <button className={styles.zoomBtn} onClick={() => zoomOut(0.2)}>−</button>
      <button className={styles.zoomBtn} onClick={() => doAutoFit()}>↺</button>
    </div>
  );
}

export function Mindmap({ data, completedNodes = [], onNodeSelect, selectedNodeId }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isEscPressed, setIsEscPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEscPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEscPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const transformRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Nếu có giữ phím modifier (Cmd, Ctrl, Alt, Shift, Esc), ta muốn Zoom.
      // Bỏ qua (không chặn) để thư viện react-zoom-pan-pinch tự xử lý Zoom.
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || isEscPressed) {
        return;
      }
      
      // Nếu KHÔNG giữ phím nào, ta muốn Pan (cuộn trang).
      // Chặn sự kiện lại không cho thư viện xử lý (vì thư viện đang được set mặc định là Zoom).
      e.preventDefault();
      e.stopPropagation();

      const ref = transformRef.current;
      if (!ref) return;
      const { positionX, positionY, scale } = ref.state;
      ref.setTransform(positionX - e.deltaX, positionY - e.deltaY, scale, 0);
    };

    container.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    return () => container.removeEventListener('wheel', handleWheel, { capture: true });
  }, [isEscPressed]);

  const rootText = data.root || (data as any).title || (data as any).name || '';
  const rawChildren = data.children || (data as any).branches || (data as any).nodes || [];
  const children: MindmapNode[] = rawChildren.map(normalizeNode);
  const numChildren = children.length;

  // The wrapper that actually receives the CSS transform
  const rootWrapperRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);
  if (childRefs.current.length !== numChildren) {
    childRefs.current = Array.from({ length: numChildren }, () => ({ current: null }));
  }

  let selectedChildIdx: number | null = null;
  if (selectedNodeId && children.length > 0) {
    const idx = children.findIndex(child => isNodeInTree(child, selectedNodeId));
    if (idx !== -1) selectedChildIdx = idx;
  }

  const currentActiveIdx = hoveredIdx !== null ? hoveredIdx : (selectedChildIdx !== null ? selectedChildIdx : expandedIdx);

  return (
    <div className={styles.container} ref={containerRef}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.3}
        maxScale={2}
        wheel={{ 
          step: 0.1, 
          activationKeys: [] // Mặc định luôn là Zoom. Pan sẽ được xử lý bằng event capture phía trên.
        }}
        limitToBounds={false}
        centerZoomedOut={false}
      >
        {() => (
          <>
            <TransformComponent wrapperClass={styles.transformWrapper}>
              <div className={styles.rootWrapper} ref={rootWrapperRef}>
                <div ref={rootNodeRef} className={`${styles.rootNode} ${(hoveredIdx !== null || selectedChildIdx !== null) ? styles.nodeActiveLine : ''} ${selectedNodeId === rootText ? styles.nodeSelected : ''}`}>
                  <span className={styles.nodeText} dangerouslySetInnerHTML={{ __html: rootText }} />
                </div>

                {numChildren > 0 && (
                  <div className={styles.childrenSvg}>
                    <SvgConnectors
                      parentRef={rootNodeRef}
                      childRefs={childRefs.current}
                      activeIdx={currentActiveIdx}
                      containerRef={rootWrapperRef}
                    />

                    {children.map((child, idx) => (
                      <div
                        key={idx}
                        ref={(el) => { childRefs.current[idx].current = el; }}
                        className={styles.childSlot}
                      >
                        <Node
                          node={child}
                          activeIdx={null}
                          isExpanded={expandedIdx === idx}
                          rootContainerRef={rootWrapperRef}
                          onToggleExpand={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                          onHover={(isHovered) => setHoveredIdx(isHovered ? idx : null)}
                          onSelect={onNodeSelect}
                          isCompleted={child.id ? completedNodes.includes(child.id) : false}
                          completedNodes={completedNodes}
                          selectedNodeId={selectedNodeId}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TransformComponent>

            <MindmapZoomControls rootWrapperRef={rootWrapperRef} containerRef={containerRef} expandedIdx={expandedIdx} />
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
