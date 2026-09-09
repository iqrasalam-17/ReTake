export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskItem {
  id: string;
  title: string;
  severity: RiskSeverity;
  extracted: string;
  inferred: string;
  risk: string;
  recommendation: string;
  category: 'CONTINUITY' | 'LOGISTICS' | 'SCHEDULE' | 'SAFETY';
}

export interface ContinuityIssue {
  id: string;
  type: 'WARDROBE' | 'PROP' | 'STATE';
  title: string;
  description: string;
  scenesInvolved: number[];
  fix: string;
}

export interface LocationIntel {
  locationName: string;
  sunsetTime: string;
  weatherNote: string;
  permitInfo: string;
  searchSource: string;
  distanceNote?: string;
  goldenHourWindow: string;
}

export interface SceneData {
  sceneNumber: number;
  heading: string;
  timeOfDay: string;
  location: string;
  characters: string[];
  wardrobe: string[];
  props: string[];
  pageCount: string;
}

export interface DayBlueprint {
  day: number;
  targetHours: string;
  locations: string[];
  scenes: number[];
  cast: string[];
  keyWardrobe: string[];
  keyProps: string[];
  notes: string;
}

export interface OptimizedSceneOrder {
  order: number;
  sceneNumber: number;
  heading: string;
  reason: string;
  day: number;
}

export interface AnalysisResult {
  productionScore: number;
  status: string;
  scenes: SceneData[];
  risks: RiskItem[];
  continuityIssues: ContinuityIssue[];
  locationIntel: LocationIntel[];
  currentPlan: {
    hours: number;
    setupSwitches: number;
    riskCount: number;
  };
  optimizedPlan: {
    hours: number;
    setupSwitches: number;
    hoursSaved: number;
  };
  optimizedShootingOrder: OptimizedSceneOrder[];
  blueprints: DayBlueprint[];
}

export interface AgentStage {
  id: number;
  code: string;
  name: string;
  description: string;
  liveStatus: string;
}
