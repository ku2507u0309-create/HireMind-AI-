import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import { getFitColor, getFitLabel } from "../data/hiremind";

function HeroPreviewCard() {
  const preview = [
    { name: "Sarah Chen", role: "Frontend Dev", score: 83 },
    { name: "Marcus Johnson", role: "Full Stack", score: 67 },
    { name: "Priya Patel", role: "Data Scientist", score: 50 },
  ];

  return (
    <div className="relative">
      <div className="absolute -top-4 -right-4 w-56 h-32 bg-brand-surface rounded-2xl border border-brand-border shadow-card-md opacity-60 rotate-3" />
      <div className="absolute -bottom-4 -left-4 w-48 h-24 bg-green-50 rounded-2xl border border-green-100 shadow-card opacity-60 -rotate-2" />
      <div className="relative bg-white rounded-2xl border border-brand-border shadow-card-lg p-5 min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">
            Match Results
          </span>
          <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full border border-green-100">
            Live
          </span>
        </div>
        <div className="space-y-3">
          {preview.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: getFitColor(c.score) }}
              >
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-heading truncate">
                  {c.name}
                </p>
                <p className="text-xs text-brand-muted">{c.role}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-lg font-bold"
                  style={{ color: getFitColor(c.score) }}
                >
                  {c.score}%
                </p>
                <p
                  className="text-xs font-medium"
                  style={{ color: getFitColor(c.score) }}
                >
                  {getFitLabel(c.score)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -top-3 -left-6 bg-white rounded-xl border border-brand-border shadow-card-md px-3 py-2 flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-brand-heading">
            Top Match Found
          </p>
          <p className="text-[10px] text-brand-muted">83% fit score</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute -bottom-3 -right-4 bg-white rounded-xl border border-brand-border shadow-card-md px-3 py-2 flex items-center gap-2"
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "#22C55E" }}
        >
          <Brain className="w-3 h-3 text-white" />
        </div>
        <p className="text-xs font-semibold text-brand-heading">
          AI analyzed in 0.4s
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-5 h-5 text-green-600" />,
      title: "Resume Analysis",
      description:
        "Extract skills, experience, and competencies from any resume format instantly with AI precision.",
    },
    {
      icon: <Brain className="w-5 h-5 text-green-600" />,
      title: "Smart Matching",
      description:
        "Rank candidates against job requirements using intelligent fit scoring and skill alignment.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      title: "Career Intelligence",
      description:
        "Generate personalized roadmaps for candidates — showing exactly how to close skill gaps.",
    },
  ];

  const stats = [
    { value: "10x", label: "Faster Screening" },
    { value: "95%", label: "Match Accuracy" },
    { value: "3min", label: "Per Candidate" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="max-w-[1200px] mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Star className="w-3 h-3" fill="currentColor" />
              AI-Powered Talent Intelligence
            </div>
            <h1
              className="font-inter font-extrabold text-brand-heading leading-[1.1] tracking-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
            >
              AI Talent
              <br />
              <span style={{ color: "#22C55E" }}>Intelligence</span>
              <br />
              Platform
            </h1>
            <p className="text-lg text-brand-body leading-relaxed mb-8 max-w-md">
              Rank candidates and generate career insights instantly. Upload
              resumes, paste a job description, and let AI surface your perfect
              hire.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Button
                onClick={() => navigate({ to: "/upload" })}
                data-ocid="landing.primary_button"
                className="h-12 px-8 text-base font-semibold text-white rounded-xl inline-flex items-center gap-2"
                style={{ background: "#22C55E" }}
              >
                Start Matching <ArrowRight className="w-4 h-4" />
              </Button>
              <button
                type="button"
                onClick={() => navigate({ to: "/match" })}
                data-ocid="landing.secondary_button"
                className="h-12 px-6 text-base font-semibold text-brand-body border border-brand-border rounded-xl hover:bg-brand-surface transition-colors"
              >
                View Demo
              </button>
            </div>
            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-brand-heading">
                    {s.value}
                  </p>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-end items-center pr-8"
          >
            <HeroPreviewCard />
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        className="bg-brand-subtle border-t border-brand-border py-20"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-brand-heading mb-3">
              Everything you need to hire smarter
            </h2>
            <p className="text-brand-body max-w-lg mx-auto">
              From resume ingestion to ranked shortlists — HireMind handles the
              entire screening pipeline in minutes.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-brand-border shadow-card p-7"
              >
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-brand-heading mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-brand-body leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-brand-heading rounded-3xl px-10 py-14 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(circle at 30% 50%, #22C55E 0%, transparent 60%), radial-gradient(circle at 70% 50%, #16A34A 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to hire 10x faster?
            </h2>
            <p className="text-gray-300 mb-8 max-w-sm mx-auto">
              Upload your first batch of resumes and see AI ranking in action —
              no setup required.
            </p>
            <Button
              onClick={() => navigate({ to: "/upload" })}
              data-ocid="landing.cta_button"
              className="h-12 px-8 font-semibold rounded-xl text-base"
              style={{ background: "#22C55E", color: "#111827" }}
            >
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
