export interface Candidate {
  id: string;
  name: string;
  currentRole: string;
  skills: string[];
  experience: number;
  summary: string;
}

export interface JobDescription {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
}

export interface RoadmapItem {
  skill: string;
  estimatedDays: number;
  description: string;
  learningSteps: string[];
  projectSuggestion: string;
  certification?: string;
}

export interface MatchResult {
  candidate: Candidate;
  fitScore: number;
  strengths: string[];
  skillGaps: string[];
  roadmap: RoadmapItem[];
  explanation: string;
  category: "Immediate Hire" | "Best Trainable" | "Risk Candidate";
  recruiterInsight: string;
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    currentRole: "Frontend Developer",
    skills: ["React", "TypeScript", "CSS", "HTML", "Vue.js"],
    experience: 4,
    summary:
      "Experienced frontend developer with strong React and TypeScript skills. Passionate about building performant, accessible user interfaces.",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    currentRole: "Full Stack Engineer",
    skills: ["Node.js", "React", "Python", "PostgreSQL", "Docker"],
    experience: 6,
    summary:
      "Versatile full stack engineer with deep backend expertise. Has led teams of 4–6 engineers across multiple product launches.",
  },
  {
    id: "3",
    name: "Priya Patel",
    currentRole: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "R"],
    experience: 3,
    summary:
      "Data scientist with hands-on ML model deployment experience. Actively transitioning into MLOps and production AI systems.",
  },
  {
    id: "4",
    name: "James Williams",
    currentRole: "Backend Developer",
    skills: ["Java", "Spring Boot", "Microservices", "AWS", "Kubernetes"],
    experience: 8,
    summary:
      "Senior backend developer with deep cloud-native expertise. Has architected systems serving 10M+ requests per day on AWS.",
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    currentRole: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD", "Terraform", "AWS"],
    experience: 5,
    summary:
      "DevOps specialist focused on infrastructure automation and reliability engineering. Reduced deployment time by 70% at previous company.",
  },
];

export const jobDescriptions: JobDescription[] = [
  {
    id: "jd1",
    title: "Senior React Developer",
    description:
      "We're looking for a senior React developer to join our product team. You'll be building next-generation user interfaces with React, TypeScript, and GraphQL. Experience with Node.js backend and AWS deployment is a strong plus. You'll collaborate closely with our design and backend teams to deliver exceptional user experiences.",
    requiredSkills: ["React", "TypeScript", "Node.js", "CSS", "GraphQL", "AWS"],
  },
  {
    id: "jd2",
    title: "ML Engineer",
    description:
      "Join our AI team to build and deploy machine learning models at scale. You'll work with Python, TensorFlow, and Docker to containerize and serve models. Kubernetes orchestration and SQL database experience are required. You'll own the full ML lifecycle from experimentation to production.",
    requiredSkills: [
      "Python",
      "TensorFlow",
      "Docker",
      "Kubernetes",
      "Machine Learning",
      "SQL",
    ],
  },
];

const skillComplexityDays: Record<string, number> = {
  GraphQL: 21,
  AWS: 45,
  TensorFlow: 45,
  Kubernetes: 45,
  Docker: 21,
  "Node.js": 21,
  TypeScript: 21,
  Python: 21,
  "Machine Learning": 45,
  SQL: 14,
  PostgreSQL: 21,
  React: 21,
  CSS: 14,
  HTML: 14,
  "Spring Boot": 30,
  Microservices: 30,
  "CI/CD": 21,
  Terraform: 30,
  "Vue.js": 21,
  Java: 30,
  R: 14,
};

const skillData: Record<
  string,
  {
    days: number;
    description: string;
    steps: string[];
    project: string;
    cert?: string;
  }
> = {
  GraphQL: {
    days: 21,
    description: "Master schema design and server implementation.",
    steps: ["Schema Design", "Resolvers", "Apollo Client"],
    project: "E-commerce Product API",
    cert: "Apollo Graph Professional",
  },
  AWS: {
    days: 45,
    description: "Cloud infrastructure and serverless.",
    steps: ["IAM & S3", "EC2 & Lambda", "VPC Networking"],
    project: "Serverless Deployment Pipeline",
    cert: "AWS Certified Developer",
  },
  React: {
    days: 21,
    description: "Advanced UI patterns and state.",
    steps: ["Hooks", "Context API", "Server Components"],
    project: "Interactive Dashboard",
    cert: "Meta Frontend Cert",
  },
  TypeScript: {
    days: 21,
    description: "Type safety and system design.",
    steps: ["Interfaces & Types", "Generics", "Utility Types"],
    project: "Typed Component Library",
  },
  "Node.js": {
    days: 21,
    description: "Backend services with JavaScript.",
    steps: ["Express.js", "Middleware", "Auth Flow"],
    project: "Real-time Chat App",
  },
  TensorFlow: {
    days: 60,
    description: "Deep learning model building.",
    steps: ["Tensors", "Keras API", "Model Deployment"],
    project: "Image Recognition Model",
    cert: "TF Developer Certificate",
  },
  Kubernetes: {
    days: 45,
    description: "Container orchestration.",
    steps: ["Pods & Services", "Ingress", "Helm Charts"],
    project: "Multi-service Deployment",
  },
  Docker: {
    days: 21,
    description: "Containerization fundamentals.",
    steps: ["Dockerfiles", "Multi-stage Builds", "Compose"],
    project: "Microservices Stack",
  },
  Python: {
    days: 21,
    description: "Master Python for backend/AI.",
    steps: ["Async Python", "Django/FastAPI", "Pandas"],
    project: "Financial Analyzer",
  },
  SQL: {
    days: 14,
    description: "Database queries and design.",
    steps: ["Complex Joins", "Aggregations", "Indexing"],
    project: "User Analytics DB",
  },
  "Machine Learning": {
    days: 60,
    description: "Building production ML systems.",
    steps: ["Data Preprocessing", "Feature Engineering", "Deployment"],
    project: "Predictive Pricing System",
  },
  CSS: {
    days: 14,
    description: "Modern layouts and animations.",
    steps: ["Flex/Grid", "Tailwind CSS", "Animations"],
    project: "Responsive Portfolio",
  },
};

export function computeMatchResults(
  job: JobDescription,
  candidateList: Candidate[],
): MatchResult[] {
  return candidateList.map((candidate) => {
    const required = job.requiredSkills;
    const strengths = candidate.skills.filter((s) =>
      required.map((r) => r.toLowerCase()).includes(s.toLowerCase()),
    );
    const skillGaps = required.filter(
      (r) =>
        !candidate.skills.map((s) => s.toLowerCase()).includes(r.toLowerCase()),
    );
    const fitScore = Math.round((strengths.length / required.length) * 100);

    const roadmap: RoadmapItem[] = skillGaps.map((skill) => {
      const data = skillData[skill] || {
        days: 21,
        description: `Study core concepts and build projects with ${skill}.`,
        steps: ["Fundamentals", "Intermediate", "Advanced"],
        project: `Sample Project with ${skill}`,
      };
      return {
        skill,
        estimatedDays: data.days,
        description: data.description,
        learningSteps: data.steps,
        projectSuggestion: data.project,
        certification: data.cert,
      };
    });

    const category =
      fitScore >= 80 && candidate.experience >= 5
        ? "Immediate Hire"
        : fitScore >= 50
          ? "Best Trainable"
          : "Risk Candidate";

    const recruiterInsight =
      category === "Immediate Hire"
        ? `${candidate.name} is a top-tier match with ${candidate.experience} years of experience and deep expertise in ${strengths.slice(0, 3).join(", ")}. Minimal onboarding needed.`
        : category === "Best Trainable"
          ? `${candidate.name} has a strong foundation but lacks ${skillGaps.slice(0, 2).join(" and ")}. Their background suggests they can upskill in ~${roadmap.reduce((sum, r) => sum + r.estimatedDays, 0)} days.`
          : `${candidate.name} lacks critical skills like ${skillGaps.slice(0, 2).join(", ")} and may require significant oversight or a different role profile.`;

    const explanation = `${candidate.name} shows a ${fitScore >= 75 ? "strong" : fitScore >= 50 ? "moderate" : "limited"} match for the ${job.title} role. They possess ${strengths.length} of ${required.length} required skills. ${recruiterInsight}`;

    return {
      candidate,
      fitScore,
      strengths,
      skillGaps,
      roadmap,
      explanation,
      category,
      recruiterInsight,
    };
  });
}

export function getFitColor(score: number): string {
  if (score >= 75) return "#22C55E";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

export function getFitLabel(score: number): string {
  if (score >= 75) return "Top Match";
  if (score >= 50) return "Good Fit";
  return "Needs Work";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
