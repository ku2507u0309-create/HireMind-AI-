import { MatchResult, JobDescription, computeMatchResults, Candidate } from "../data/hiremind";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Lightbulb, Plus, Check, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface WhatIfSimulatorProps {
  initialResult: MatchResult;
  job: JobDescription;
}

export default function WhatIfSimulator({ initialResult, job }: WhatIfSimulatorProps) {
  const [simulatedSkills, setSimulatedSkills] = useState<string[]>(initialResult.candidate.skills);
  
  const currentResult = useMemo(() => {
    const tempCandidate: Candidate = {
      ...initialResult.candidate,
      skills: simulatedSkills
    };
    return computeMatchResults(job, [tempCandidate])[0];
  }, [simulatedSkills, job, initialResult.candidate]);

  const missingSkills = job.requiredSkills.filter(
    s => !simulatedSkills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())
  );

  const handleToggleSkill = (skill: string) => {
    setSimulatedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const hasChanges = simulatedSkills.length !== initialResult.candidate.skills.length;

  return (
    <div className="bg-brand-heading text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold">What-If Simulation</h3>
            <p className="text-[10px] text-white/50 lowercase tracking-wide">Predict fit score improvements</p>
          </div>
        </div>
        {hasChanges && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSimulatedSkills(initialResult.candidate.skills)}
            className="text-xs text-white/60 hover:text-white hover:bg-white/10 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
        )}
      </div>

      <div className="p-6">
        {/* Score Comparison */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-white/40 mb-1">Current</p>
            <p className="text-3xl font-black text-white/60">{initialResult.fitScore}%</p>
          </div>
          <motion.div 
            initial={false}
            animate={{ 
              scale: currentResult.fitScore > initialResult.fitScore ? [1, 1.1, 1] : 1,
              color: currentResult.fitScore > initialResult.fitScore ? "#4ade80" : "#ffffff"
            }}
            className="text-center"
          >
            <p className="text-[10px] font-bold uppercase text-white/40 mb-1">Simulated</p>
            <p className="text-5xl font-black">{currentResult.fitScore}%</p>
          </motion.div>
        </div>

        {/* Actionable Gaps */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-white/60 uppercase">Add skills to simulate growth:</p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map(skill => {
              const isInitiallyPossessed = initialResult.candidate.skills.includes(skill);
              const isSimulated = simulatedSkills.includes(skill) && !isInitiallyPossessed;
              
              if (isInitiallyPossessed) return null;

              return (
                <button
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSimulated 
                      ? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20" 
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {isSimulated ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delta Insight */}
        {hasChanges && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="flex gap-3 items-start p-3 rounded-xl bg-white/5 text-xs text-white/80 border border-white/5 italic">
              <span className="text-green-400 font-bold">Insight:</span>
              <span>
                By acquiring these {simulatedSkills.length - initialResult.candidate.skills.length} skills, 
                {initialResult.candidate.name}'s fit score increases by {currentResult.fitScore - initialResult.fitScore}%. 
                {currentResult.category === "Immediate Hire" && " This would elevate them to an Immediate Hire category!"}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
