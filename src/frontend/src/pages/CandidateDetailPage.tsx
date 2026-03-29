import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, Lightbulb, CheckCircle2, Zap, Award, Terminal, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import WhatIfSimulator from "../components/WhatIfSimulator";
import { useApp } from "../context/AppContext";
import {
  computeMatchResults,
  candidates as demoCandidates,
  getFitColor,
  getFitLabel,
  getInitials,
  jobDescriptions,
} from "../data/hiremind";

export default function CandidateDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { matchResults, selectedJobId } = useApp();

  const job =
    jobDescriptions.find((j) => j.id === selectedJobId) ?? jobDescriptions[0];
  const allResults =
    matchResults.length > 0
      ? matchResults
      : computeMatchResults(job, demoCandidates).sort(
          (a, b) => b.fitScore - a.fitScore,
        );

  const result = allResults.find((r) => r.candidate.id === id);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-semibold text-brand-heading mb-2">
            Candidate not found
          </p>
          <Button
            onClick={() => navigate({ to: "/leaderboard" })}
            variant="outline"
            className="rounded-xl"
          >
            Back to Leaderboard
          </Button>
        </div>
      </div>
    );
  }

  const { candidate, fitScore, strengths, skillGaps, roadmap, explanation, recruiterInsight } =
    result;
  const totalDays = roadmap.reduce((sum, r) => sum + r.estimatedDays, 0);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/leaderboard" })}
            data-ocid="candidate.link"
            className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-heading font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-brand-border rounded-2xl shadow-card-md p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: getFitColor(fitScore) }}
            >
              {getInitials(candidate.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-brand-heading">
                  {candidate.name}
                </h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-brand-subtle text-brand-muted rounded border border-brand-border">
                  {result.category}
                </span>
              </div>
              <p className="text-brand-muted mb-2">
                {candidate.currentRole} · {candidate.experience} years
                experience
              </p>
              <p className="text-sm text-brand-body leading-relaxed max-w-lg">
                {candidate.summary}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p
                className="font-extrabold leading-none mb-1"
                style={{ fontSize: "72px", color: getFitColor(fitScore) }}
              >
                {fitScore}
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: getFitColor(fitScore) }}
              >
                {getFitLabel(fitScore)}
              </p>
              <p className="text-xs text-brand-muted mt-1">vs. {job.title}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Simulation Block */}
            <WhatIfSimulator initialResult={result} job={job} />

            <div className="bg-white border border-brand-border rounded-2xl shadow-card p-6">
              <h2 className="text-sm font-bold text-brand-heading mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Strengths
              </h2>
              {strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-success-light text-success border-green-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-brand-muted">
                  No matching skills for this role.
                </p>
              )}
            </div>

            <div className="bg-white border border-brand-border rounded-2xl shadow-card p-6">
              <h2 className="text-sm font-bold text-brand-heading mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Actionable Gaps
              </h2>
              {skillGaps.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillGaps.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-danger-light text-danger border-red-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-brand-muted">
                  No skill gaps — strong match!
                </p>
              )}
            </div>

            <div className="bg-brand-heading text-white border border-brand-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold">Recruiter Intelligence</h2>
              </div>
              <p className="text-xs leading-relaxed text-white/80 relative z-10">
                {recruiterInsight}
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Lightbulb className="w-24 h-24" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white border border-brand-border rounded-3xl shadow-card overflow-hidden">
              <div
                className="p-8 border-b border-brand-border"
                style={{
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#22C55E" }}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-heading leading-tight">
                      Advanced AI Roadmap
                    </h2>
                    <p className="text-xs text-brand-muted uppercase tracking-wider font-bold">Upskilling Intel Engine</p>
                  </div>
                </div>
                <p className="text-sm text-brand-body mt-4">
                  {roadmap.length > 0
                    ? `Hyper-personalized learning roadmap to reach 100% fit score in ${totalDays} days`
                    : "Full technical alignment — no upskilling required for this JD."}
                </p>
              </div>
              <div className="p-8">
                {roadmap.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-heading">
                      Perfect Alignment!
                    </p>
                    <p className="text-sm text-brand-muted mt-2">
                      Candidate has mastered all {job.requiredSkills.length} required technical skills.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-brand-border border-dashed" />
                    <div className="space-y-10">
                      {roadmap.map((item, i) => (
                        <motion.div
                          key={item.skill}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="flex gap-6 relative"
                        >
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-black flex-shrink-0 z-10 border-4 border-white shadow-md"
                            style={{ background: "#22C55E" }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-brand-heading text-base">
                                  {item.skill} Mastery
                                </h3>
                                <div className="flex items-center gap-1.5 text-[10px] text-brand-muted uppercase font-bold tracking-widest">
                                  <Clock className="w-3 h-3" />
                                  <span>{item.estimatedDays} days to proficiency</span>
                                </div>
                              </div>
                              {item.certification && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                                  <Award className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-[10px] font-bold text-amber-700">{item.certification}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-brand-body leading-relaxed mb-4">
                              {item.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl bg-brand-subtle border border-brand-border">
                                <div className="flex items-center gap-2 mb-2">
                                  <Terminal className="w-3.5 h-3.5 text-brand-heading" />
                                  <span className="text-[10px] font-bold text-brand-heading uppercase">Curated Steps</span>
                                </div>
                                <ul className="space-y-1.5">
                                  {item.learningSteps.map(step => (
                                    <li key={step} className="text-xs text-brand-body flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-brand-muted" />
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-3.5 h-3.5 text-brand-heading" />
                                  <span className="text-[10px] font-bold text-brand-heading uppercase">Recommended Project</span>
                                </div>
                                <p className="text-xs text-brand-body font-medium">
                                  {item.projectSuggestion}
                                </p>
                                <p className="text-[10px] text-brand-muted mt-2 leading-tight">
                                  Build this to demonstrate core {item.skill} principles in an interview context.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
