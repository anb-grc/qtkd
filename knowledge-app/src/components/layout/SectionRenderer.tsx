import React, { useState } from 'react';
import type { Section } from '../../types/schema';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { ErrorBoundary } from '../common/ErrorBoundary';
import styles from './SectionRenderer.module.css';

interface SectionRendererProps {
  sections: Section[];
  level?: number; // 1 = H1, 2 = H2, 3 = H3
}

function SectionItem({ section, level = 1 }: { section: Section; level: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const HeadingTag = `h${Math.min(level, 3)}` as keyof React.JSX.IntrinsicElements;
  const headingClass = level === 1 ? 'section-h1' : level === 2 ? 'section-h2' : 'section-h3';

  return (
    <div className={styles.section}>
      {/* Tiêu đề section (Tiêu đề La Mã có gạch chân bám sát nội dung) */}
      <div 
        className={`${styles.sectionHeader} ${isCollapsed ? styles.collapsedHeader : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <HeadingTag className={`${headingClass} ${styles.headingTitle}`}>
          {section.title}
        </HeadingTag>
      </div>

      {!isCollapsed && (
        <div className={styles.sectionBody}>
          {/* Nội dung nguyên bản (content layer) */}
          {section.content && (
            <div
              className="section-content"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}

          {/* Visual blocks (đánh số tự nhiên 1, 2, 3...) */}
          {section.blocks && section.blocks.length > 0 && (
            <div className={styles.blocks}>
              {section.blocks.map((block, blockIndex) => (
                <ErrorBoundary key={blockIndex} fallbackTitle={block.title}>
                  <BlockRenderer block={block} index={blockIndex + 1} />
                </ErrorBoundary>
              ))}
            </div>
          )}

          {/* Sub-sections (đệ quy) */}
          {section.sub_sections && section.sub_sections.length > 0 && (
            <SectionRenderer
              sections={section.sub_sections}
              level={level + 1}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SectionRenderer — Đệ quy render H1 → H2 → H3.
 * Mỗi section hiển thị: tiêu đề la mã (gạch chân ôm sát nội dung) → content nguyên bản → blocks (đánh số tự nhiên 1, 2, 3) → sub_sections.
 */
export function SectionRenderer({ sections, level = 1 }: SectionRendererProps) {
  return (
    <div className={styles.sections}>
      {sections.map((section, index) => (
        <SectionItem key={index} section={section} level={level} />
      ))}
    </div>
  );
}
