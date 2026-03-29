import { MatchResult } from "../data/hiremind";
import { motion } from "motion/react";
import { TrendingUp, AlertCircle, Sparkles, BookOpen } from "lucide-react";

interface RecruiterInsightsPanelProps {
  results: MatchResult[];
}

export default function RecruiterInsightsPanel({ results }: RecruiterInsightsPanelProps) {
  const topCandidate = results[0];
  const allGaps = results.flatMap(r => r.skillGaps);
  const commonGaps = [...new Set(allGaps)].filter(gap => 
    allGaps.filter(g => g === gap).length > 2
  ).slice(0, 3);

  const stats = [
    {
      label: "Top Candidate Fit",
      value: `${topCandidate?.fitScore || 0}%`,
      subValue: topCandidate?.category || "Top Performer",
      color: "#22C55E",
      icon: <Sparkles className="w-5 h-5 text-green-600" />
    },
    {
      label: "Common Skill Gaps",
      value: `${commonGaps.length > 0 ? commonGaps[0] : "None"}`,
      subValue: `Across ${results.length} candidates`,
      color: "#F59E0B",
      icon: <BookOpen className="w-5 h-5 text-amber-600" />
    },
    {
      label: "Hiring Risk",
      value: results.some(r => r.category === "Risk Candidate") ? "Active Risks" : "Low Risk",
      subValue: "AI Risk Analysis",
      color: "#EF4444",
      icon: <AlertCircle className="w-5 h-5 text-red-600" />
    }
  ];

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden mb-12">
      <div className="p-6 border-b border-brand-border bg-brand-subtle">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-brand-heading" />
          <h2 className="text-base font-bold text-brand-heading">Recruiter Insights Panel</h2>
        </div>
        <p className="text-xs text-brand-muted">AI-driven summary of current candidate pool</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-brand-border">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 flex items-start gap-4 hover:bg-brand-subtle transition-colors"
          >
            <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-brand-heading">
                  {stat.value}
                </span>
                <span className="text-[10px] font-medium text-brand-muted whitespace-nowrap">
                  {stat.subValue}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-brand-subtle border-t border-brand-border">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-medium text-brand-body italic">
            "Candidate {topCandidate?.candidate.name} is the strongest match due to their {topCandidate?.strengths.length} key skill matches." - HireMind AI
          </p>
        </div>
      </div>
    </div>
  );
}
