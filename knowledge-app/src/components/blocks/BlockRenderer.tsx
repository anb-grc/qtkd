import type { Block } from '../../types/schema';
import { BlockWrapper } from '../common/BlockWrapper';
import { slugify } from '../../utils/stringUtils';

// Import 8 original components
import { Mindmap } from './Mindmap';
import { Timeline } from './Timeline';
import { Features } from './Features';
import { VsWrap } from './VsWrap';
import { FlipCard } from './FlipCard';
import { Venn } from './Venn';
import { Formula } from './Formula';
import { Funnel } from './Funnel';
import { Quiz } from './Quiz';

// Import remaining components
import { Pyramid } from './Pyramid';
import { Quadrant } from './Quadrant';
import { Cycle } from './Cycle';
import { ProcessSteps } from './ProcessSteps';
import { Onion } from './Onion';
import { Hotspot } from './Hotspot';
import { TAccount } from './TAccount';
import { Spectrum } from './Spectrum';
import { Carousel } from './Carousel';
import { MatrixTable } from './MatrixTable';
import { RadarChart } from './RadarChart';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { ScatterPlot } from './ScatterPlot';
import { AreaChart } from './AreaChart';
import { SankeyDiagram } from './SankeyDiagram';
import { WaterfallChart } from './WaterfallChart';
import { GaugeChart } from './GaugeChart';
import { Treemap } from './Treemap';
import { DecisionTree } from './DecisionTree';
import { ChatSimulation } from './ChatSimulation';
import { PairGrid } from './PairGrid';
import { JourneyMap } from './JourneyMap';
import { InteractiveCalc } from './InteractiveCalc';
import { DeltaCheatSheet } from './DeltaCheatSheet';

interface BlockRendererProps {
  block: Block;
  index?: number;
  qsData?: any[];
  onQuizPass?: () => void;
}

export function BlockRenderer({ block, index, qsData, onQuizPass }: BlockRendererProps) {
  const renderContent = () => {
    switch (block.type) {
      case 'mindmap':
        return <Mindmap data={block.data} />;
      case 'timeline':
        return <Timeline data={block.data} />;
      case 'features':
        return <Features data={block.data} />;
      case 'vs-wrap':
        return <VsWrap data={block.data} />;
      case 'flip-card':
        return <FlipCard data={block.data} />;
      case 'venn':
      case 'venn-diagram':
        return <Venn data={block.data} />;
      case 'formula':
      case 'formula-breakdown':
        return <Formula data={block.data as any} />;
      case 'funnel':
        return <Funnel data={block.data} />;
      case 'pyramid':
        return <Pyramid data={block.data} />;
      case 'quadrant':
        return <Quadrant data={block.data} />;
      case 'cycle':
        return <Cycle data={block.data} />;
      case 'flowchart':
      case 'process-steps':
        return <ProcessSteps data={block.data} />;
      case 'onion':
        return <Onion data={block.data} />;
      case 'hotspot':
        return <Hotspot data={block.data} />;
      case 't-account':
        return <TAccount data={block.data} />;
      case 'spectrum':
        return <Spectrum data={block.data} />;
      case 'carousel':
        return <Carousel data={block.data} />;
      case 'matrix-table':
        return <MatrixTable data={block.data} />;
      case 'quiz': {
        const quizData = block.data as any;
        let pool = [...(quizData.questions || [])];
        
        if (qsData && qsData.length > 0) {
          let matchedQs = [];
          if (quizData.quiz_tags && Array.isArray(quizData.quiz_tags) && quizData.quiz_tags.length > 0) {
            const matchTags = quizData.quiz_tags.map((t: string) => slugify(t));
            matchedQs = qsData.filter(q => {
              const qTags = Array.isArray(q.tags) ? q.tags.map((t: string) => slugify(t)) : [];
              return matchTags.some((mt: string) => qTags.includes(mt));
            });
          } else {
            // Fallback: Nếu không khai báo thẻ, lấy toàn bộ ngân hàng câu hỏi
            matchedQs = [...qsData];
          }

          const formattedQs = matchedQs.map(q => ({
             question: q.question || q.q || '',
             options: q.options || q.choices || [],
             correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : (q.answer || 0),
             explanation: q.explanation || q.note || ''
          }));
          
          pool = [...pool, ...formattedQs];
        }
        
        return <Quiz data={{ ...quizData, questions: pool }} onPass={onQuizPass} />;
      }
      case 'radar-chart':
        return <RadarChart data={block.data} />;
      case 'line-chart':
        return <LineChart data={block.data} />;
      case 'bar-chart':
        return <BarChart data={block.data} />;
      case 'scatter-plot':
        return <ScatterPlot data={block.data} />;
      case 'area-chart':
        return <AreaChart data={block.data} />;
      case 'sankey-diagram':
        return <SankeyDiagram data={block.data} />;
      case 'waterfall-chart':
        return <WaterfallChart data={block.data} />;
      case 'gauge-chart':
        return <GaugeChart data={block.data} />;
      case 'treemap':
        return <Treemap data={block.data} />;
      case 'decision-tree':
        return <DecisionTree data={block.data} />;
      case 'chat-simulation':
        return <ChatSimulation data={block.data} />;
      case 'pair-grid':
        return <PairGrid data={block.data} />;
      case 'journey-map':
        return <JourneyMap data={block.data} />;
      case 'interactive-calc':
        return <InteractiveCalc data={block.data} />;
      case 'delta-cheat-sheet':
        return <DeltaCheatSheet data={block.data} />;
      default:
        return (
          <div style={{
            padding: 'var(--space-md)',
            background: 'rgba(108, 92, 231, 0.05)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
          }}>
            <code>[{(block as any).type}]</code> — Đang xây dựng...
          </div>
        );
    }
  };

  const isQuiz = block.type === 'quiz';
  let blockTitle = block.title;
  if (isQuiz) {
    blockTitle = '';
  }

  return (
    <BlockWrapper title={blockTitle} id={block.id} index={index}>
      {renderContent()}
    </BlockWrapper>
  );
}
