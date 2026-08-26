// ============================================================
// ROOT SCHEMA — Cấu trúc dữ liệu Kiến thức nền
// ============================================================

export interface KnowledgeBase {
  subject: string;
  overview: MindmapBlock;
  details: {
    node_id: string;
    components: Block[];
  }[];
}

export interface Section {
  title: string;
  content?: string;
  blocks?: Block[];
  sub_sections?: Section[];
}

// ============================================================
// BLOCK — DISCRIMINATED UNION (21 types)
// ============================================================

export interface BaseBlock {
  type: string;
  id?: string;
  title: string;
}

export type Block =
  | TimelineBlock
  | FeaturesBlock
  | MindmapBlock
  | PyramidBlock
  | FormulaBlock
  | FormulaBreakdownBlock
  | VsWrapBlock
  | QuadrantBlock
  | CycleBlock
  | FlowchartBlock
  | ProcessStepsBlock
  | OnionBlock
  | VennBlock
  | VennDiagramBlock
  | HotspotBlock
  | TAccountBlock
  | FlipCardBlock
  | SpectrumBlock
  | CarouselBlock
  | MatrixTableBlock
  | FunnelBlock
  | QuizBlock
  | RadarChartBlock
  | LineChartBlock
  | BarChartBlock
  | ScatterPlotBlock
  | AreaChartBlock
  | SankeyDiagramBlock
  | WaterfallChartBlock
  | GaugeChartBlock
  | TreemapBlock
  | DecisionTreeBlock
  | ChatSimulationBlock
  | PairGridBlock
  | JourneyMapBlock
  | InteractiveCalcBlock
  | DeltaCheatSheetBlock;

// ============================================================
// 6D = What (Cấu trúc) — 5 components
// ============================================================

export interface MindmapBlock extends BaseBlock {
  type: 'mindmap';
  data: {
    root: string;
    children: MindmapNode[];
  };
}

export interface MindmapNode {
  id?: string;
  label: string;
  description?: string;
  children?: MindmapNode[];
}

export interface PyramidBlock extends BaseBlock {
  type: 'pyramid';
  data: {
    levels: {
      name: string;
      description?: string;
    }[];
  };
}

export interface OnionBlock extends BaseBlock {
  type: 'onion';
  data: {
    layers: {
      name: string;
      description?: string;
    }[];
  };
}

export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  data: {
    items: {
      title: string;
      description: string;
    }[];
  };
}

export interface FunnelBlock extends BaseBlock {
  type: 'funnel';
  data: {
    stages: {
      name: string;
      description?: string;
      value?: string;
    }[];
  };
}

// ============================================================
// 6D = How (Quy trình) — 4 components
// ============================================================

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  data: {
    items: {
      time: string;
      content: string;
    }[];
  };
}

export interface FlowchartBlock extends BaseBlock {
  type: 'flowchart';
  data: {
    steps: {
      name: string;
      description?: string;
    }[];
  };
}

export interface ProcessStepsBlock extends BaseBlock {
  type: 'process-steps';
  data: {
    steps: {
      name: string;
      description?: string;
    }[];
  };
}

export interface CycleBlock extends BaseBlock {
  type: 'cycle';
  data: {
    steps: {
      name: string;
      description?: string;
    }[];
  };
}

// ============================================================
// 6D = VS (Tương quan) — 5 components
// ============================================================

export interface VsWrapBlock extends BaseBlock {
  type: 'vs-wrap';
  data: {
    left: {
      title: string;
      content: string;
    };
    right: {
      title: string;
      content: string;
    };
  };
}

export interface VennBlock extends BaseBlock {
  type: 'venn';
  data: {
    left: { title: string; items?: string[] };
    right: { title: string; items?: string[] };
    intersection: string;
  };
}

export interface VennDiagramBlock extends BaseBlock {
  type: 'venn-diagram';
  data: {
    left: { title: string; items?: string[] };
    right: { title: string; items?: string[] };
    intersection: string;
  };
}

export interface QuadrantBlock extends BaseBlock {
  type: 'quadrant';
  data: {
    x_axis?: string;
    y_axis?: string;
    quadrants: [
      { title: string; content: string },
      { title: string; content: string },
      { title: string; content: string },
      { title: string; content: string }
    ];
  };
}

export interface MatrixTableBlock extends BaseBlock {
  type: 'matrix-table';
  data: {
    headers: string[];
    rows: string[][];
  };
}

// ============================================================
// 6D = Math (Định lượng) — 3 components
// ============================================================

export interface FormulaBlock extends BaseBlock {
  type: 'formula';
  data: {
    formula: string;
    variables: {
      symbol: string;
      definition: string;
    }[];
  };
}

export interface FormulaBreakdownBlock extends BaseBlock {
  type: 'formula-breakdown';
  data: {
    formula: string;
    variables: {
      symbol: string;
      definition: string;
    }[];
    example?: string;
  };
}

export interface TAccountBlock extends BaseBlock {
  type: 't-account';
  data: {
    left: {
      header: string;
      entries: string[];
    };
    right: {
      header: string;
      entries: string[];
    };
  };
}

// ============================================================
// 6D = Trap (Ngoại lệ) — 2 components
// ============================================================

export interface FlipCardBlock extends BaseBlock {
  type: 'flip-card';
  data: {
    front: string;
    back: string;
  };
}

export interface QuizBlock extends BaseBlock {
  type: 'quiz';
  data: {
    quiz_tags?: string[];
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    questions?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }[];
  };
}

export interface HotspotBlock extends BaseBlock {
  type: 'hotspot';
  data: {
    imageUrl: string;
    points: {
      x: number;
      y: number;
      title: string;
      description: string;
    }[];
  };
}

// ============================================================
// 6D = Case (Ứng dụng) — 2 components
// ============================================================

export interface SpectrumBlock extends BaseBlock {
  type: 'spectrum';
  data: {
    items: {
      title: string;
      description?: string;
    }[];
  };
}

export interface CarouselBlock extends BaseBlock {
  type: 'carousel';
  data: {
    items: {
      title: string;
      description: string;
    }[];
  };
}

// ============================================================
// Trụ Lực 2 = Biểu Đồ Thống Kê & Tương Quan — 5 components
// ============================================================

export interface RadarChartBlock extends BaseBlock {
  type: 'radar-chart';
  data: {
    axes: string[];
    datasets: {
      label: string;
      values: number[]; // 0 - 100
      color?: string;
      description?: string;
    }[];
  };
}

export interface LineChartBlock extends BaseBlock {
  type: 'line-chart';
  data: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    points: {
      label: string;
      value: number;
      annotation?: string;
      explanation?: string;
    }[];
  };
}

export interface BarChartBlock extends BaseBlock {
  type: 'bar-chart';
  data: {
    title?: string;
    orientation?: 'vertical' | 'horizontal';
    maxValue?: number;
    items: {
      label: string;
      value: number;
      unit?: string;
      highlight?: boolean;
      explanation?: string;
    }[];
  };
}

export interface ScatterPlotBlock extends BaseBlock {
  type: 'scatter-plot';
  data: {
    title?: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
    quadrants?: {
      topLeft?: string;
      topRight?: string;
      bottomLeft?: string;
      bottomRight?: string;
    };
    points: {
      name: string;
      x: number;
      y: number;
      size?: number;
      category?: string;
      strategy: string;
    }[];
  };
}

export interface AreaChartBlock extends BaseBlock {
  type: 'area-chart';
  data: {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    thresholdValue?: number;
    thresholdLabel?: string;
    points: {
      label: string;
      value: number;
      note?: string;
    }[];
    positiveRegionExplanation?: string;
    negativeRegionExplanation?: string;
  };
}

// ============================================================
// ĐỢT 2: Bộ 5 Đồ Thị Chuyển Động (Trụ 3)
// ============================================================

export interface SankeyDiagramBlock extends BaseBlock {
  type: 'sankey-diagram';
  data: {
    title?: string;
    flows: {
      from: string;
      to: string;
      value: number;
      highlight?: boolean;
      explanation?: string;
    }[];
  };
}

export interface WaterfallChartBlock extends BaseBlock {
  type: 'waterfall-chart';
  data: {
    title?: string;
    unit?: string;
    steps: {
      label: string;
      value: number;
      type?: 'start' | 'add' | 'sub' | 'total';
      note?: string;
      explanation?: string;
    }[];
  };
}

export interface GaugeChartBlock extends BaseBlock {
  type: 'gauge-chart';
  data: {
    title?: string;
    min?: number;
    max?: number;
    currentValue: number;
    valueLabel?: string;
    unit?: string;
    zones?: {
      min: number;
      max: number;
      label: string;
      color?: string;
      advice?: string;
    }[];
  };
}

export interface TreemapBlock extends BaseBlock {
  type: 'treemap';
  data: {
    title?: string;
    rootLabel?: string;
    items: {
      id?: string;
      name: string;
      value: number;
      category?: string;
      highlight?: boolean;
      details?: string;
    }[];
  };
}

export interface DecisionTreeBlock extends BaseBlock {
  type: 'decision-tree';
  data: {
    title?: string;
    startNodeId: string;
    nodes: Record<string, {
      label: string;
      question?: string;
      outcome?: string;
      isTrap?: boolean;
      explanation?: string;
      options?: {
        text: string;
        nextNodeId: string;
        tag?: string;
      }[];
    }>;
  };
}

// ============================================================
// ĐỢT 3: Bộ 5 Bản Thực Chiến & Ghi Nhớ Phản Xạ (Trụ 4)
// ============================================================

export interface ChatSimulationBlock extends BaseBlock {
  type: 'chat-simulation';
  data: {
    title?: string;
    scenario?: string;
    messages: {
      sender: string;
      role?: string;
      avatar?: string;
      text: string;
      isTrap?: boolean;
      highlight?: boolean;
      note?: string;
    }[];
  };
}

export interface PairGridBlock extends BaseBlock {
  type: 'pair-grid';
  data: {
    title?: string;
    instruction?: string;
    pairs: {
      id: string;
      leftText: string;
      rightText: string;
      explanation?: string;
    }[];
  };
}

export interface JourneyMapBlock extends BaseBlock {
  type: 'journey-map';
  data: {
    title?: string;
    persona?: string;
    stages: {
      stage: string;
      action: string;
      emotion: 'positive' | 'neutral' | 'negative' | 'frustration';
      painPoint?: string;
      solution?: string;
      trapWarning?: string;
    }[];
  };
}

export interface InteractiveCalcBlock extends BaseBlock {
  type: 'interactive-calc';
  data: {
    title?: string;
    formulaLabel?: string;
    description?: string;
    inputs: {
      id: string;
      name: string;
      defaultValue: number;
      unit?: string;
      step?: number;
      min?: number;
      max?: number;
      weight?: number;
    }[];
    operation?: 'add' | 'multiply' | 'subtract' | 'divide' | 'weighted-sum';
    resultLabel?: string;
    unit?: string;
    diagnoses?: {
      minThreshold: number;
      maxThreshold: number;
      message: string;
      color?: string;
    }[];
  };
}

export interface DeltaCheatSheetBlock extends BaseBlock {
  type: 'delta-cheat-sheet';
  data: {
    title?: string;
    categoryFilters?: string[];
    items: {
      questionSnippet: string;
      keyword: string;
      correctDelta: string;
      wrongTraps: string[];
      explanation: string;
      category?: string;
    }[];
  };
}
