import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GrainOverlay } from './components/GrainOverlay';
import { CustomCursor } from './components/CustomCursor';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AnalyzeSection } from './components/AnalyzeSection';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ResultsDashboard } from './components/ResultsDashboard';
import { CinematicError } from './components/CinematicError';
import { Footer } from './components/Footer';
import { DEMO_SCREENPLAY, DEMO_CONSTRAINTS } from './data/demoScreenplay';
import { MOCK_ANALYSIS_RESULT } from './data/mockAnalysis';
import { AnalysisResult } from './types/analysis';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(MOCK_ANALYSIS_RESULT);

  // Screenplay & Constraints inputs
  const [screenplayText, setScreenplayText] = useState<string>(DEMO_SCREENPLAY);
  const [constraintsText, setConstraintsText] = useState<string>(DEMO_CONSTRAINTS);

  const handleNavigate = (sectionId: string) => {
    if (showResults) {
      setShowResults(false);
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleRunAnalysis = () => {
    if (!screenplayText.trim()) return;
    setErrorMessage(null);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    console.log('[RETAKE CLIENT] Received full production intelligence dossier:', result);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisError = (errMessage: string) => {
    console.error('[RETAKE CLIENT] Pipeline failed:', errMessage);
    setIsAnalyzing(false);
    setErrorMessage(errMessage);
  };

  const handleResetAnalysis = () => {
    setShowResults(false);
    setTimeout(() => {
      const el = document.getElementById('analyze');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewDemo = () => {
    setScreenplayText(DEMO_SCREENPLAY);
    setConstraintsText(DEMO_CONSTRAINTS);
    handleNavigate('analyze');
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#F5B841] selection:text-black font-sans">
      {/* Film Grain SVG Overlay */}
      <GrainOverlay />

      {/* Cinematic Vignette */}
      <div className="vignette-effect" />

      {/* Custom Amber Cursor */}
      <CustomCursor />

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Cinematic Error State Modal */}
      <AnimatePresence>
        {errorMessage && (
          <CinematicError
            errorMessage={errorMessage}
            onRetry={handleRunAnalysis}
            onDismiss={() => setErrorMessage(null)}
          />
        )}
      </AnimatePresence>

      {/* Analysis Progress Screen Modal */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnalysisProgress
              screenplay={screenplayText}
              constraints={constraintsText}
              onComplete={handleAnalysisComplete}
              onError={handleAnalysisError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Container */}
      <div className={`transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        {/* Fixed Navigation Bar */}
        <Navbar onNavigate={handleNavigate} />

        {/* View Switching: Either Landing + Analyze, or Results Dashboard */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.45 }}
              >
                <ResultsDashboard
                  result={analysisResult}
                  onReset={handleResetAnalysis}
                />
              </motion.div>
            ) : (
              <motion.div
                key="main-flow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* 01. Hero Section */}
                <Hero
                  onAnalyzeClick={() => handleNavigate('analyze')}
                  onViewDemoClick={handleViewDemo}
                />

                {/* 02. The Problem Section */}
                <ProblemSection />

                {/* 03. How It Works Section (7 Agents) */}
                <HowItWorksSection />

                {/* 04. Analyze Section */}
                <AnalyzeSection
                  screenplayText={screenplayText}
                  setScreenplayText={setScreenplayText}
                  constraintsText={constraintsText}
                  setConstraintsText={setConstraintsText}
                  onRunAnalysis={handleRunAnalysis}
                  isLoading={isAnalyzing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
