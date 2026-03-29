import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Sparkles, Trophy, Zap, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useMemo } from "react";
import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";
import {
  type MatchResult,
  computeMatchResults,
  candidates as demoCandidates,
  getFitColor,
  getFitLabel,
  getInitials,
  jobDescriptions,
} from "../data/hiremind";

function FitScoreBadge({ score }: { score: number }) {
  return (
    <div className="text-center">
      <p
        className="font-extrabold leading-none"
        style={{ fontSize: "64px", color: getFitColor(score) }}
      >
        {score}
      </p>
      <p
        className="text-sm font-semibold mt-1"
        style={{ color: getFitColor(score) }}
      >
        {getFitLabel(score)}
      </p>
    </div>
  );
}

function CandidateCard({
  result,
  rank,
}: { result: MatchResult; rank: number }) {
  const navigate = useNavigate();
  const { candidate, fitScore, strengths, skillGaps } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white border border-brand-border rounded-2xl shadow-card hover:shadow-card-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: getFitColor(fitScore) }}
          >
            {getInitials(candidate.name)}
          </div>
          <div>
            <p className="font-semibold text-brand-heading">{candidate.name}</p>
            <p className="text-sm text-brand-muted">{candidate.currentRole}</p>
          </div>
        </div>
        {rank === 1 && (
          <div className="bg-amber-50 text-amber-600 text-xs font-semibold px-2 py-1 rounded-full border border-amber-100 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> #1
          </div>
        )}
      </div>

      <div className="flex justify-center py-4 mb-5 bg-brand-subtle rounded-xl">
        <FitScoreBadge score={fitScore} />
      </div>

      {strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
            Strengths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {strengths.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2 py-0.5 rounded-full border bg-success-light text-success border-green-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {skillGaps.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
            Skill Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skillGaps.map((s) => (
              <span
                key={s}
                className="text-xs font-medium px-2 py-0.5 rounded-full border bg-danger-light text-danger border-red-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() =>
          navigate({ to: "/candidate/$id", params: { id: candidate.id } })
        }
        variant="outline"
        data-ocid={`match.card.button.${rank}`}
        className="w-full rounded-xl text-sm font-medium border-brand-border text-brand-body hover:text-brand-heading hover:bg-brand-subtle"
      >
        View Profile
      </Button>
    </motion.div>
  );
}

export default function MatchDashboard() {
  const {
    candidates,
    setMatchResults,
    matchResults,
    jobDescriptions,
    setJobDescriptions,
    selectedJobId,
    setSelectedJobId,
  } = useApp();
  
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState("Custom Role");
  const [customSkills, setCustomSkills] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  
  const activeCandidates = candidates.length > 0 ? candidates : demoCandidates;
  
  const selectedJob = useMemo(() => {
    if (isCustomMode) {
      return {
        id: "custom",
        title: customTitle,
        description: customDesc,
        requiredSkills: customSkills.split(",").map(s => s.trim()).filter(s => s !== ""),
      };
    }
    return jobDescriptions.find((j) => j.id === selectedJobId) ?? jobDescriptions[0];
  }, [isCustomMode, selectedJobId, jobDescriptions, customTitle, customDesc, customSkills]);

  const [jobText, setJobText] = useState(selectedJob.description);
  const [matching, setMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(matchResults.length > 0);

  const handleJobChange = (id: string) => {
    setSelectedJobId(id);
    const job = jobDescriptions.find((j) => j.id === id);
    if (job) setJobText(job.description);
  };

  const runMatch = async () => {
    setMatching(true);
    await new Promise((r) => setTimeout(r, 900));
    const results = computeMatchResults(selectedJob, activeCandidates);
    const sorted = [...results].sort((a, b) => b.fitScore - a.fitScore);
    setMatchResults(sorted);
    setHasMatched(true);
    setMatching(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-brand-heading mb-2">
            Match Dashboard
          </h1>
          <p className="text-brand-body">
            Select a job description and run AI matching to rank your
            candidates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-brand-border rounded-2xl shadow-card p-8 mb-8"
        >
          <div className="flex items-center gap-1 bg-brand-subtle p-1 rounded-xl w-fit mb-8">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isCustomMode ? "bg-white shadow-sm text-brand-heading" : "text-brand-muted hover:text-brand-body"}`}
            >
              Standard Roles
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isCustomMode ? "bg-white shadow-sm text-brand-heading" : "text-brand-muted hover:text-brand-body"}`}
            >
              Personalized Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] block mb-3">
                {isCustomMode ? "Custom Position Title" : "Market Role"}
              </p>
              {isCustomMode ? (
                <div className="relative">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Lead Product Engineer"
                    className="w-full rounded-xl border-brand-border h-11 px-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ) : (
                <Select value={selectedJobId} onValueChange={handleJobChange}>
                  <SelectTrigger
                    data-ocid="match.select"
                    className="rounded-xl border-brand-border h-11 bg-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {jobDescriptions.map((j) => (
                      <SelectItem key={j.id} value={j.id} className="rounded-lg">
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] block mb-3">
                Required Core Competencies
              </p>
              {isCustomMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customSkills}
                    onChange={(e) => setCustomSkills(e.target.value)}
                    placeholder="Enter skills separated by commas (e.g. React, Docker, Python)"
                    className="w-full rounded-xl border-brand-border h-11 px-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {selectedJob.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 flex items-center gap-1.5 group"
                      >
                        {s}
                        <button 
                          onClick={() => setCustomSkills(prev => prev.split(",").filter(skill => skill.trim().toLowerCase() !== s.toLowerCase()).join(","))}
                          className="hover:text-red-500"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    {selectedJob.requiredSkills.length === 0 && (
                      <span className="text-[10px] text-brand-muted italic">Type skills above to start mapping...</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-brand-body shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] block mb-3">
              Role Intelligence Parameters (Description)
            </p>
            <Textarea
              value={isCustomMode ? customDesc : jobText}
              onChange={(e) => isCustomMode ? setCustomDesc(e.target.value) : setJobText(e.target.value)}
              placeholder="Paste the full job description here. HireMind AI will extract nuances and implied requirements..."
              data-ocid="match.textarea"
              rows={5}
              className="rounded-2xl border-brand-border resize-none text-sm text-brand-body p-4 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-brand-subtle/30"
            />
          </div>

          <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-brand-border/50 border-dashed">
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {activeCandidates.slice(0, 3).map((c, i) => (
                   <div key={c.id} className="w-8 h-8 rounded-full border-2 border-white bg-brand-surface flex items-center justify-center text-[10px] font-bold" style={{ zIndex: 3-i }}>
                     {getInitials(c.name)}
                   </div>
                 ))}
               </div>
               <p className="text-xs font-bold text-brand-muted">
                {activeCandidates.length} potential matches analyzed
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isCustomMode && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newId = `custom-${Date.now()}`;
                    setJobDescriptions(prev => [...prev, {
                      id: newId,
                      title: customTitle,
                      description: customDesc,
                      requiredSkills: selectedJob.requiredSkills,
                    }]);
                    setSelectedJobId(newId);
                    setIsCustomMode(false);
                    setJobText(customDesc);
                  }}
                  className="text-xs font-bold text-brand-muted hover:text-green-600 rounded-xl"
                >
                  Save as Template
                </Button>
              )}
              <Button
                onClick={runMatch}
                disabled={matching || (isCustomMode && !customTitle)}
                data-ocid="match.primary_button"
                className="h-12 px-10 font-black text-white rounded-2xl text-sm inline-flex items-center gap-2 shadow-xl hover:shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "#22C55E" }}
              >
                {matching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating fit...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" fill="currentColor" /> Match
                    Candidates
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hasMatched && matchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-brand-heading">
                  Ranked Results
                </h2>
                <span className="text-sm text-brand-muted">
                  {matchResults.length} candidates ranked
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchResults.map((result, i) => (
                  <CandidateCard
                    key={result.candidate.id}
                    result={result}
                    rank={i + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasMatched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="match.empty_state"
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-brand-muted" />
            </div>
            <p className="text-lg font-semibold text-brand-heading mb-2">
              Ready to match
            </p>
            <p className="text-sm text-brand-muted max-w-xs mx-auto">
              Click "Match Candidates" above to rank all candidates against the
              selected job.
            </p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
