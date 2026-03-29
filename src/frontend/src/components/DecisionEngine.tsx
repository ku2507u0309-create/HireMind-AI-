import { MatchResult, getFitColor, getInitials } from "../data/hiremind";
import { motion } from "motion/react";
import { Zap, GraduationCap, AlertTriangle, Info } from "lucide-react";

interface DecisionEngineProps {
  results: MatchResult[];
  onSelect: (id: string) => void;
}

export default function DecisionEngine({ results, onSelect }: DecisionEngineProps) {
  // Ensure we have at least 3 candidates to display different ones if possible
  // We deduplicate by NAME to handle cases where the same person might have been uploaded twice
  const immediate = results.find(r => r.category === "Immediate Hire") || results[0];
  
  const trainable = results.find(r => 
    r.candidate.name.toLowerCase() !== immediate.candidate.name.toLowerCase() && 
    (r.category === "Best Trainable" || (r.fitScore > 50 && r.fitScore < 85))
  ) || results.find(r => r.candidate.name.toLowerCase() !== immediate.candidate.name.toLowerCase()) || results[1] || results[0];
  
  const risk = results.find(r => 
    r.candidate.name.toLowerCase() !== immediate.candidate.name.toLowerCase() && 
    r.candidate.name.toLowerCase() !== trainable.candidate.name.toLowerCase() && 
    (r.category === "Risk Candidate" || r.fitScore < 50)
  ) || results.find(r => 
    r.candidate.name.toLowerCase() !== immediate.candidate.name.toLowerCase() && 
    r.candidate.name.toLowerCase() !== trainable.candidate.name.toLowerCase()
  ) || results[2] || results[1] || results[0];

  const cards = [
    {
      title: "Best Immediate Hire",
      result: immediate,
      icon: <Zap className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      accentColor: "#16a34a",
      label: "Ready Now"
    },
    {
      title: "Best Trainable",
      result: trainable,
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      accentColor: "#2563eb",
      label: "High Potential"
    },
    {
      title: "Risk Candidate",
      result: risk,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      accentColor: "#d97706",
      label: "Needs Review"
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-brand-heading">AI Hiring Decisions</h2>
        <span className="text-xs font-semibold px-2 py-0.5 bg-brand-subtle text-brand-muted rounded-full">Automated Analysis</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.bgColor} p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            onClick={() => onSelect(card.result.candidate.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-white shadow-sm">
                {card.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/50 border border-white/20">
                {card.label}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
                style={{ background: getFitColor(card.result.fitScore) }}
              >
                {getInitials(card.result.candidate.name)}
              </div>
              <div>
                <h3 className="font-bold text-brand-heading leading-none mb-1 group-hover:text-black transition-colors">
                  {card.result.candidate.name}
                </h3>
                <p className="text-xs text-brand-muted line-clamp-1">
                  {card.result.candidate.currentRole}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-black" style={{ color: card.accentColor }}>
                {card.result.fitScore}%
              </span>
              <span className="text-[10px] font-medium text-brand-muted uppercase">Match Score</span>
            </div>

            <div className="p-3 rounded-xl bg-white/60 border border-white/40 text-xs italic text-brand-body leading-relaxed flex gap-2">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-brand-muted" />
              <span>{card.result.recruiterInsight}</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
