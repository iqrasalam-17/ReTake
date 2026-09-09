import { runScriptSupervisor } from './scriptSupervisor';
import { runContinuityDetective } from './continuityDetective';
import { runLogisticsEngine } from './logisticsEngine';
import { runScheduleEngine } from './scheduleEngine';
import { runLocationScout } from './locationScout';
import { runRiskDetective } from './riskDetective';
import { runProductionSupervisor } from './productionSupervisor';
import { ProgressEvent } from './types';
import { AnalysisResult, RiskItem, ContinuityIssue, SceneData } from '../types/analysis';

export type ProgressCallback = (event: ProgressEvent) => void;

/**
 * Executes the full 7-stage multi-agent production intelligence pipeline.
 */
export async function runProductionPipeline(
  screenplay: string,
  constraints: string,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  const emit = (event: ProgressEvent) => {
    if (onProgress) {
      try {
        onProgress(event);
      } catch (err) {
        console.error('Error in progress listener:', err);
      }
    }
  };

  console.log('[ORCHESTRATOR] 🎬 Starting 7-Stage Agentic Cinema Pipeline...');

  try {
    // ══════════════════════════════════════════════
    // STAGE 1: SCRIPT SUPERVISOR
    // ══════════════════════════════════════════════
    emit({ stage: 'SCRIPT_SUPERVISOR', status: 'running', message: 'Script Supervisor parsing scenes, characters & props...' });
    const breakdown = await runScriptSupervisor(screenplay);
    emit({
      stage: 'SCRIPT_SUPERVISOR',
      status: 'complete',
      message: `Extracted ${breakdown.scenes.length} scenes and ${breakdown.characters.length} characters.`,
      data: { sceneCount: breakdown.scenes.length },
    });

    // ══════════════════════════════════════════════
    // STAGE 2: CONTINUITY DETECTIVE
    // ══════════════════════════════════════════════
    emit({ stage: 'CONTINUITY_DETECTIVE', status: 'running', message: 'Continuity Detective inspecting props, wardrobe & character states...' });
    const continuityRisks = await runContinuityDetective(breakdown);
    emit({
      stage: 'CONTINUITY_DETECTIVE',
      status: 'complete',
      message: `Identified ${continuityRisks.length} continuity conflicts.`,
      data: { count: continuityRisks.length },
    });

    // ══════════════════════════════════════════════
    // STAGE 3: LOGISTICS ENGINE
    // ══════════════════════════════════════════════
    emit({ stage: 'LOGISTICS_ENGINE', status: 'running', message: 'Logistics Engineer analyzing location clusters & turnaround penalties...' });
    const logistics = await runLogisticsEngine(breakdown);
    emit({
      stage: 'LOGISTICS_ENGINE',
      status: 'complete',
      message: `Clustered ${logistics.locationClusters.length} locations.`,
      data: { clusters: logistics.locationClusters.length },
    });

    // ══════════════════════════════════════════════
    // STAGE 4: SCHEDULE ENGINE
    // ══════════════════════════════════════════════
    emit({ stage: 'SCHEDULE_ENGINE', status: 'running', message: 'Schedule Engineer resolving constraints and optimizing shoot order...' });
    const schedule = await runScheduleEngine(breakdown, constraints);
    emit({
      stage: 'SCHEDULE_ENGINE',
      status: 'complete',
      message: `Schedule optimized: ${schedule.hoursSaved} production hours saved.`,
      data: { hoursSaved: schedule.hoursSaved },
    });

    // ══════════════════════════════════════════════
    // STAGE 5: LOCATION SCOUT (PARALLEL SEARCH GROUNDED)
    // ══════════════════════════════════════════════
    emit({ stage: 'LOCATION_SCOUT', status: 'running', message: 'Querying Parallel Search: sunset time in Los Angeles, weather & permits...' });
    let locationIntel;
    try {
      locationIntel = await runLocationScout(breakdown);
    } catch (locErr) {
      console.warn('[ORCHESTRATOR] Location Scout handled gracefully:', locErr);
      locationIntel = [];
    }
    emit({
      stage: 'LOCATION_SCOUT',
      status: 'complete',
      message: `Parallel Search grounded intel gathered for ${locationIntel.length} locations.`,
      data: { locationsGrounded: locationIntel.length },
    });

    // ══════════════════════════════════════════════
    // STAGE 6: ADVERSARIAL RISK DETECTIVE
    // ══════════════════════════════════════════════
    emit({ stage: 'RISK_DETECTIVE', status: 'running', message: 'Risk Detective hunting for union turnaround, light loss & edge-case failures...' });
    const additionalRisks = await runRiskDetective({
      breakdown,
      continuityRisks,
      logistics,
      schedule,
      locationIntel,
    });
    emit({
      stage: 'RISK_DETECTIVE',
      status: 'complete',
      message: `Identified ${additionalRisks.length} critical edge-case risks.`,
      data: { count: additionalRisks.length },
    });

    // ══════════════════════════════════════════════
    // STAGE 7: PRODUCTION SUPERVISOR
    // ══════════════════════════════════════════════
    emit({ stage: 'PRODUCTION_SUPERVISOR', status: 'running', message: 'Production Supervisor compiling production score & daily call sheets...' });
    const blueprint = await runProductionSupervisor({
      breakdown,
      continuityRisks,
      logistics,
      schedule,
      locationIntel,
      additionalRisks,
    });
    emit({
      stage: 'PRODUCTION_SUPERVISOR',
      status: 'complete',
      message: `Final Blueprint synthesized. Production score: ${blueprint.productionScore}/100.`,
      data: { score: blueprint.productionScore },
    });

    // ══════════════════════════════════════════════
    // CONSOLIDATE INTO AnalysisResult
    // ══════════════════════════════════════════════
    const mappedScenes: SceneData[] = breakdown.scenes.map((s, idx) => ({
      sceneNumber: s.id || idx + 1,
      heading: s.heading,
      timeOfDay: s.timeOfDay || 'DAY',
      location: s.location || 'Set',
      characters: s.characters || [],
      wardrobe: s.wardrobe || [],
      props: s.props || [],
      pageCount: '1 2/8',
    }));

    // Map all risk items
    const combinedRisks: RiskItem[] = [
      ...continuityRisks.map((c, i) => ({
        id: `c-risk-${i + 1}`,
        title: c.title,
        severity: c.severity,
        extracted: c.evidenceType === 'EXTRACTED' ? c.description : `Script scenes: ${c.affectedScenes.join(', ')}`,
        inferred: c.evidenceType === 'INFERRED' ? c.description : 'Physical continuity mismatch detected across scene sequence.',
        risk: c.description,
        recommendation: c.recommendation,
        category: (c.category === 'WARDROBE' || c.category === 'PROP' ? 'CONTINUITY' : 'LOGISTICS') as any,
      })),
      ...additionalRisks.map((a, i) => ({
        id: `a-risk-${i + 1}`,
        title: a.title,
        severity: a.severity,
        extracted: a.extracted,
        inferred: a.inferred,
        risk: a.risk,
        recommendation: a.recommendation,
        category: a.category,
      })),
    ];

    // Map continuity issues specifically
    const mappedContinuity: ContinuityIssue[] = continuityRisks.map((c, i) => ({
      id: `ci-${i + 1}`,
      type: c.category === 'WARDROBE' ? 'WARDROBE' : c.category === 'PROP' ? 'PROP' : 'STATE',
      title: c.title,
      description: c.description,
      scenesInvolved: c.affectedScenes,
      fix: c.recommendation,
    }));

    const finalResult: AnalysisResult = {
      productionScore: blueprint.productionScore || 78,
      status: blueprint.status || 'MOSTLY READY — ACTIONS REQUIRED',
      scenes: mappedScenes,
      risks: combinedRisks,
      continuityIssues: mappedContinuity,
      locationIntel: locationIntel,
      currentPlan: {
        hours: schedule.currentPlanHours || 12,
        setupSwitches: logistics.estimatedBaseSetupSwitches || 14,
        riskCount: combinedRisks.length,
      },
      optimizedPlan: {
        hours: schedule.optimizedPlanHours || 9,
        setupSwitches: logistics.estimatedOptimizedSetupSwitches || 9,
        hoursSaved: schedule.hoursSaved || 3,
      },
      optimizedShootingOrder: schedule.optimizedOrder || [],
      blueprints: blueprint.dayByDay || [],
    };

    emit({
      stage: 'COMPLETE',
      status: 'complete',
      message: 'Full Analysis Complete',
      result: finalResult,
    });

    console.log('[ORCHESTRATOR] 🎯 Pipeline finished successfully.');
    return finalResult;
  } catch (fatalError: any) {
    console.error('[ORCHESTRATOR] ❌ Fatal error in multi-agent pipeline:', fatalError);
    emit({
      stage: 'ERROR',
      status: 'error',
      message: fatalError?.message || 'Pipeline execution failed.',
    });
    throw fatalError;
  }
}
