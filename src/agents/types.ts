import { RiskSeverity, RiskItem, ContinuityIssue, LocationIntel, SceneData, DayBlueprint, OptimizedSceneOrder, AnalysisResult } from '../types/analysis';

export interface ExtractedScene {
  id: number;
  heading: string;
  location: string;
  timeOfDay: string;
  characters: string[];
  props: string[];
  wardrobe: string[];
  actionSummary: string;
}

export interface ExtractedCharacter {
  name: string;
  appearances: number[];
}

export interface ExtractedLocation {
  name: string;
  scenes: number[];
  interiorExterior: 'INT' | 'EXT' | 'INT/EXT';
}

export interface ExtractedProp {
  name: string;
  scenes: number[];
}

export interface ExtractedWardrobe {
  character: string;
  item: string;
  scenes: number[];
}

export interface SceneBreakdown {
  scenes: ExtractedScene[];
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
  props: ExtractedProp[];
  wardrobe: ExtractedWardrobe[];
}

export interface ContinuityRisk {
  category: 'WARDROBE' | 'PROP' | 'STATE' | 'LOCATION';
  severity: RiskSeverity;
  title: string;
  description: string;
  affectedScenes: number[];
  recommendation: string;
  evidenceType: 'EXTRACTED' | 'INFERRED';
}

export interface LogisticsAnalysis {
  locationClusters: {
    locationName: string;
    scenes: number[];
    isFragmented: boolean;
  }[];
  turnaroundWarnings: string[];
  avoidableMovements: string[];
  logisticalImprovements: string[];
  estimatedBaseSetupSwitches: number;
  estimatedOptimizedSetupSwitches: number;
}

export interface ScheduleAnalysis {
  currentPlanHours: number;
  optimizedPlanHours: number;
  hoursSaved: number;
  optimizedOrder: {
    order: number;
    sceneNumber: number;
    heading: string;
    reason: string;
    day: number;
  }[];
  reasoning: string[];
}

export interface AdditionalRisk {
  title: string;
  severity: RiskSeverity;
  category: 'SCHEDULE' | 'LOGISTICS' | 'SAFETY' | 'CONTINUITY';
  extracted: string;
  inferred: string;
  risk: string;
  recommendation: string;
}

export interface FinalBlueprint {
  productionScore: number;
  status: string;
  recommendations: string[];
  dayByDay: {
    day: number;
    targetHours: string;
    locations: string[];
    scenes: number[];
    cast: string[];
    keyWardrobe: string[];
    keyProps: string[];
    notes: string;
  }[];
}

export type PipelineStage = 
  | 'SCRIPT_SUPERVISOR'
  | 'CONTINUITY_DETECTIVE'
  | 'LOGISTICS_ENGINE'
  | 'SCHEDULE_ENGINE'
  | 'LOCATION_SCOUT'
  | 'RISK_DETECTIVE'
  | 'PRODUCTION_SUPERVISOR'
  | 'COMPLETE'
  | 'ERROR';

export interface ProgressEvent {
  stage: PipelineStage;
  status: 'running' | 'complete' | 'error';
  message?: string;
  data?: any;
  result?: AnalysisResult;
}
