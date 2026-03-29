import { type ReactNode, createContext, useContext, useState } from "react";
import {
  type Candidate,
  type MatchResult,
  candidates as defaultCandidates,
  jobDescriptions as defaultJobDescriptions,
  type JobDescription,
} from "../data/hiremind";

interface AppContextValue {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  selectedJobId: string;
  setSelectedJobId: React.Dispatch<React.SetStateAction<string>>;
  matchResults: MatchResult[];
  setMatchResults: React.Dispatch<React.SetStateAction<MatchResult[]>>;
  demoLoaded: boolean;
  setDemoLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  jobDescriptions: JobDescription[];
  setJobDescriptions: React.Dispatch<React.SetStateAction<JobDescription[]>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidatesInternal] = useState<Candidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("jd1");
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(defaultJobDescriptions);
  
  const setCandidates = (newCandidates: React.SetStateAction<Candidate[]>) => {
    setCandidatesInternal((prev) => {
      const updated = typeof newCandidates === "function" ? (newCandidates as any)(prev) : newCandidates;
      // Deduplicate by name
      const uniqueByName = new Map();
      for (const c of updated) {
        if (!uniqueByName.has(c.name.toLowerCase())) {
          uniqueByName.set(c.name.toLowerCase(), c);
        }
      }
      return Array.from(uniqueByName.values());
    });
  };

  return (
    <AppContext.Provider
      value={{
        candidates,
        setCandidates,
        selectedJobId,
        setSelectedJobId,
        matchResults,
        setMatchResults,
        demoLoaded,
        setDemoLoaded,
        jobDescriptions,
        setJobDescriptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
