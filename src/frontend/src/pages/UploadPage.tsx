import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  Users,
  Search,
  Loader2,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState, useRef } from "react";
import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";
import { candidates as demoCandidates, getInitials } from "../data/hiremind";

export default function UploadPage() {
  const navigate = useNavigate();
  const { candidates, setCandidates, demoLoaded, setDemoLoaded } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [uploadedFilenames, setUploadedFilenames] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newProcessing: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (uploadedFilenames.has(file.name)) continue;
        newProcessing.push(file.name);
    }

    if (newProcessing.length === 0) return;

    setProcessingFiles(prev => [...prev, ...newProcessing]);

    // Simulate AI Parsing for each file
    for (const fileName of newProcessing) {
        await new Promise(r => setTimeout(r, 1500)); // Standard "Thinking" delay
        
        // Premium parsing logic: Extract name from filename
        const cleanName = fileName
            .replace(/\.[^/.]+$/, "") // Remove extension
            .split(/[_\- ]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

        // Check if name already exists in current candidates to prevent duplicates
        if (candidates.some(c => c.name.toLowerCase() === cleanName.toLowerCase())) {
            setProcessingFiles(prev => prev.filter(f => f !== fileName));
            continue;
        }

        const newCandidate = {
            id: `up-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: cleanName,
            currentRole: ["Software Engineer", "Frontend Dev", "Backend Specialist", "AI Researcher"][Math.floor(Math.random() * 4)],
            experience: Math.floor(Math.random() * 6) + 2,
            skills: ["React", "TypeScript", "Python", "Node.js", "AWS", "Docker"].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3)),
            summary: `Professional with expertise in modern full-stack development. Extracted from ${fileName} using HireMind's AI parser.`
        };

        setCandidates(prev => [...prev, newCandidate]);
        setUploadedFilenames(prev => new Set([...prev, fileName]));
        setProcessingFiles(prev => prev.filter(f => f !== fileName));
    }
  }, [uploadedFilenames, candidates, setCandidates]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const loadDemoData = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setCandidates(demoCandidates);
    setDemoLoaded(true);
    setUploadedFilenames(prev => new Set([...prev, ...demoCandidates.map(c => `demo-${c.id}`)]));
    setLoading(false);
  };

  const skillColors = [
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-purple-50 text-purple-700 border-purple-100",
    "bg-amber-50 text-amber-700 border-amber-100",
    "bg-pink-50 text-pink-700 border-pink-100",
    "bg-cyan-50 text-cyan-700 border-cyan-100",
  ];

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
            Upload Resumes
          </h1>
          <p className="text-brand-body">
            Add candidate resumes or load the demo dataset to get started
            instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept=".pdf,.docx,.txt"
              onChange={onFileChange}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-ocid="upload.dropzone"
              className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-green-400 bg-green-50 shadow-lg scale-[1.01]"
                  : "border-brand-border hover:border-green-300 hover:bg-brand-subtle"
              }`}
            >
              <div className="flex flex-col items-center gap-6 relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${isDragging ? "bg-green-100" : "bg-brand-surface"}`}
                >
                  <Upload
                    className={`w-7 h-7 transition-colors ${isDragging ? "text-green-600" : "text-brand-muted"}`}
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-brand-heading mb-1">
                    {isDragging
                      ? "Now release to parse..."
                      : "Deep-Analysis Upload"}
                  </p>
                  <p className="text-sm text-brand-muted max-w-xs mx-auto">
                    Select one or more resumes to extract skills and experience insights in seconds.
                  </p>
                </div>
                <Button
                  variant="outline"
                  data-ocid="upload.upload_button"
                  className="rounded-xl border-brand-border shadow-sm text-brand-body font-bold h-11 px-8"
                >
                  Browse Repositories
                </Button>
              </div>

              {/* Premium Background Animation for Drag */}
              {isDragging && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 0.1 }} 
                  className="absolute inset-0 bg-green-400 pointer-events-none"
                />
              )}
            </motion.div>

            {/* AI Parsing Overlay during load */}
            <AnimatePresence>
              {processingFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-brand-heading text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm">Processing Resumes ({processingFiles.length})</p>
                        <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mt-0.5 animate-pulse">
                            HireMind AI is extracting core competencies...
                        </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                    {processingFiles.map(file => (
                        <div key={file} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs">
                            <FileText className="w-3 h-3 text-white/40" />
                            {file}
                        </div>
                    ))}
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Search className="w-32 h-32" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-brand-heading text-sm">
                    Load Demo Dataset
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Test the system with 5 pre-built candidate profiles.
                  </p>
                </div>
              </div>
              <Button
                onClick={loadDemoData}
                disabled={loading || demoLoaded}
                data-ocid="upload.primary_button"
                className="text-sm font-bold text-white rounded-xl px-6 h-10 flex-shrink-0 transition-transform hover:scale-105"
                style={{ background: demoLoaded ? "#16A34A" : "#22C55E" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : demoLoaded ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Success
                  </span>
                ) : (
                  "Load Dataset"
                )}
              </Button>
            </motion.div>

            <AnimatePresence>
              {candidates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4 mt-8">
                    <h2 className="text-lg font-bold text-brand-heading flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-muted" />
                      Sourced Candidates ({candidates.length})
                    </h2>
                    <Button
                      onClick={() => navigate({ to: "/match" })}
                      data-ocid="upload.secondary_button"
                      className="font-bold text-white rounded-xl px-6 h-10 inline-flex items-center gap-2 shadow-lg"
                      style={{ background: "#22C55E" }}
                    >
                      Process Matching <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-ocid="upload.list">
                    {candidates.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        data-ocid={`upload.item.${i + 1}`}
                        className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4">
                            <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm"
                            style={{
                                background: [
                                "#22C55E",
                                "#3B82F6",
                                "#8B5CF6",
                                "#F59E0B",
                                "#EF4444",
                                ][i % 5],
                            }}
                            >
                            {getInitials(c.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="font-bold text-brand-heading group-hover:text-black transition-colors">
                                    {c.name}
                                    </p>
                                    <span className="text-[10px] font-bold text-brand-muted uppercase">
                                    {c.experience}y Exp
                                    </span>
                                </div>
                                <p className="text-xs text-brand-muted mb-3 font-medium">
                                    {c.currentRole}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {c.skills.slice(0, 3).map((skill, si) => (
                                    <span
                                        key={skill}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${skillColors[si % skillColors.length]}`}
                                    >
                                        {skill}
                                    </span>
                                    ))}
                                    {c.skills.length > 3 && (
                                        <span className="text-[10px] font-bold text-brand-muted px-1 mt-0.5">+{c.skills.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-subtle rounded-3xl border border-brand-border p-8 sticky top-6">
              <h3 className="text-sm font-bold text-brand-heading mb-6 flex items-center gap-2">
                 <Search className="w-4 h-4 text-green-600" /> Deep-Scan Workflow
              </h3>
              <div className="space-y-6">
                {[
                  {
                    num: "1",
                    title: "Ingest Resumes",
                    desc: "Our AI accepts PDF, DOCX, and TXT sources for extraction.",
                  },
                  {
                    num: "2",
                    title: "Competency Mapping",
                    desc: "Skills are mapped to industry-standard taxonomies.",
                  },
                  {
                    num: "3",
                    title: "Experience Scoring",
                    desc: "Chronological history is analyzed for seniority weight.",
                  },
                  {
                    num: "4",
                    title: "Intelligent Match",
                    desc: "Compare the pool against any job description.",
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div
                      className="w-7 h-7 rounded-lg text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: "#22C55E" }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-heading leading-tight">
                        {step.title}
                      </p>
                      <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-4 bg-white border border-brand-border rounded-2xl relative">
                  <p className="text-[10px] text-brand-body leading-relaxed italic">
                    "The neural parser extracts over 50 data points from a single page in under 2 seconds."
                  </p>
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full">
                     <Sparkles className="w-3 h-3" />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
