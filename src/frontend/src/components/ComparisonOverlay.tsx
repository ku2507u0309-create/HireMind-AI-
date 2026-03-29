import { MatchResult, getFitColor, getInitials } from "../data/hiremind";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, AlertCircle, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ComparisonOverlayProps {
  candidates: MatchResult[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonOverlay({ candidates, isOpen, onClose }: ComparisonOverlayProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-subtle">
            <div>
              <h2 className="text-xl font-bold text-brand-heading">Candidate Comparison</h2>
              <p className="text-xs text-brand-muted">Side-by-side match breakdown</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Comparison Content */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className={`grid grid-cols-1 md:grid-cols-${candidates.length} gap-8 h-full`}>
              {candidates.map((res, i) => (
                <div key={res.candidate.id} className={`flex flex-col h-full ${i < candidates.length - 1 ? 'md:border-r border-dashed border-brand-border pr-0 md:pr-8' : ''}`}>
                  {/* Candidate Profile */}
                  <div className="text-center mb-8">
                    <div 
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg"
                      style={{ background: getFitColor(res.fitScore) }}
                    >
                      {getInitials(res.candidate.name)}
                    </div>
                    <h3 className="text-lg font-bold text-brand-heading mb-1">{res.candidate.name}</h3>
                    <p className="text-sm text-brand-muted mb-2">{res.candidate.currentRole}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle border border-brand-border">
                      <span className="text-xs font-black" style={{ color: getFitColor(res.fitScore) }}>{res.fitScore}%</span>
                      <span className="text-[10px] font-bold text-brand-muted uppercase">Match</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3 flex items-center gap-2">
                       <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Key Strengths
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {res.strengths.slice(0, 4).map(s => (
                        <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses / Gaps */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3 flex items-center gap-2">
                       <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Skill Gaps
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {res.skillGaps.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Insight */}
                  <div className="mt-auto p-4 rounded-2xl bg-brand-subtle border border-brand-border relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-heading" />
                      <span className="text-[10px] font-bold uppercase text-brand-heading">AI Recommendation</span>
                    </div>
                    <p className="text-xs text-brand-body leading-relaxed line-clamp-4 italic">
                      {res.recruiterInsight}
                    </p>
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                      <HelpCircle className="w-8 h-8 text-brand-heading" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-brand-border bg-white flex justify-center">
            <Button 
               className="rounded-xl px-8 py-6 font-bold text-lg" 
               style={{ background: "#22C55E" }}
               onClick={onClose}
            >
              Close Comparison
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
