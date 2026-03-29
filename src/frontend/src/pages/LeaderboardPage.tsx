import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import { Medal, Trophy, Layers, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Footer from "../components/Footer";
import DecisionEngine from "../components/DecisionEngine";
import RecruiterInsightsPanel from "../components/RecruiterInsightsPanel";
import ComparisonOverlay from "../components/ComparisonOverlay";
import { useApp } from "../context/AppContext";
import {
  computeMatchResults,
  candidates as demoCandidates,
  getFitColor,
  getFitLabel,
  getInitials,
  jobDescriptions,
} from "../data/hiremind";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { matchResults, selectedJobId } = useApp();
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const defaultJob =
    jobDescriptions.find((j) => j.id === selectedJobId) ?? jobDescriptions[0];
  const defaultResults = computeMatchResults(defaultJob, demoCandidates).sort(
    (a, b) => b.fitScore - a.fitScore,
  );
  const results = matchResults.length > 0 ? matchResults : defaultResults;

  const toggleComparison = (id: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const comparisonCandidates = results.filter((r) =>
    selectedForComparison.includes(r.candidate.id),
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-brand-heading mb-2">
              Candidate Leaderboard
            </h1>
            <p className="text-brand-body">
              Ranked by AI fit score for{" "}
              <span className="font-medium text-brand-heading">
                {defaultJob.title}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedForComparison([])}
              className="rounded-xl px-5 h-9"
              disabled={selectedForComparison.length === 0}
            >
              Clear Selection
            </Button>
            <Button
              onClick={() => navigate({ to: "/match" })}
              data-ocid="leaderboard.primary_button"
              className="text-sm font-semibold text-white rounded-xl px-5 h-9"
              style={{ background: "#22C55E" }}
            >
              Run New Match
            </Button>
          </div>
        </motion.div>

        {/* Intelligence Layer */}
        <DecisionEngine 
          results={results} 
          onSelect={(id) => navigate({ to: "/candidate/$id", params: { id } })}
        />
        
        <RecruiterInsightsPanel results={results} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-heading">All Rankings</h2>
          <p className="text-xs text-brand-muted">
            Select up to 3 candidates to compare side-by-side
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden mb-20"
          data-ocid="leaderboard.table"
        >
          <div className="grid grid-cols-[48px_56px_1fr_1fr_180px_120px] gap-4 px-6 py-3 bg-brand-subtle border-b border-brand-border">
             <div />
            {["Rank", "Name", "Current Role", "Fit Score", "Status"].map(
              (h) => (
                <p
                  key={h}
                  className="text-xs font-semibold text-brand-muted uppercase tracking-wider"
                >
                  {h}
                </p>
              ),
            )}
          </div>
          {results.map((result, i) => {
            const isTop = i === 0;
            const isSelected = selectedForComparison.includes(result.candidate.id);
            return (
              <div
                key={result.candidate.id}
                className={`grid grid-cols-[48px_56px_1fr_1fr_180px_120px] gap-4 px-6 py-4 border-b border-brand-border last:border-0 w-full text-left transition-colors hover:bg-brand-subtle ${
                  isTop ? "border-l-4 border-l-green-400" : ""
                } ${isSelected ? "bg-brand-subtle" : ""}`}
              >
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => toggleComparison(result.candidate.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-brand-heading border-brand-heading" 
                        : "border-brand-border hover:border-brand-muted"
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </button>
                </div>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate({ to: "/candidate/$id", params: { id: result.candidate.id } })}
                >
                  {i === 0 ? (
                    <Trophy className="w-5 h-5 text-amber-500" />
                  ) : (
                    <span className="text-sm font-semibold text-brand-muted">
                      #{i + 1}
                    </span>
                  )}
                </div>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate({ to: "/candidate/$id", params: { id: result.candidate.id } })}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: getFitColor(result.fitScore) }}
                  >
                    {getInitials(result.candidate.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-heading">
                      {result.candidate.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {result.candidate.experience}y exp
                    </p>
                  </div>
                </div>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate({ to: "/candidate/$id", params: { id: result.candidate.id } })}
                >
                  <span className="text-sm text-brand-body">
                    {result.candidate.currentRole}
                  </span>
                </div>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate({ to: "/candidate/$id", params: { id: result.candidate.id } })}
                >
                  <span
                    className="text-sm font-bold w-10"
                    style={{ color: getFitColor(result.fitScore) }}
                  >
                    {result.fitScore}%
                  </span>
                  <Progress
                    value={result.fitScore}
                    className="flex-1 h-2 rounded-full"
                  />
                </div>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate({ to: "/candidate/$id", params: { id: result.candidate.id } })}
                >
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      background:
                        result.fitScore >= 75
                          ? "#f0fdf4"
                          : result.fitScore >= 50
                            ? "#fffbeb"
                            : "#fef2f2",
                      color: getFitColor(result.fitScore),
                      borderColor:
                        result.fitScore >= 75
                          ? "#bbf7d0"
                          : result.fitScore >= 50
                            ? "#fde68a"
                            : "#fecaca",
                    }}
                  >
                    {getFitLabel(result.fitScore)}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Comparison Bar */}
      <AnimatePresence>
        {selectedForComparison.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-brand-heading text-white px-6 py-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {selectedForComparison.map((id) => {
                  const r = results.find((res) => res.candidate.id === id);
                  return (
                    <div
                      key={id}
                      className="w-10 h-10 rounded-full border-2 border-brand-heading flex items-center justify-center text-xs font-bold ring-2 ring-white/10"
                      style={{ background: getFitColor(r?.fitScore || 0) }}
                    >
                      {getInitials(r?.candidate.name || "")}
                    </div>
                  );
                })}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">
                  {selectedForComparison.length} Candidate{selectedForComparison.length > 1 ? "s" : ""} Selected
                </p>
                <p className="text-[10px] text-white/60">Compare strengths vs weaknesses</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <Button
              className="bg-white text-brand-heading hover:bg-brand-subtle rounded-xl px-6 py-2 h-auto font-bold flex gap-2"
              onClick={() => setIsComparisonOpen(true)}
              disabled={selectedForComparison.length < 2}
            >
              <Layers className="w-4 h-4" /> Compare Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparisonOverlay 
        candidates={comparisonCandidates} 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
      />

      <Footer />
    </div>
  );
}
