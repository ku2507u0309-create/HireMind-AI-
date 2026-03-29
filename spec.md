# HireMind AI

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Landing page with hero: "AI Talent Intelligence Platform", subtitle, "Start Matching" CTA
- Upload page: drag-and-drop resume upload, "Load Demo Data" button, candidate list
- Match Dashboard: job description textarea, "Match Candidates" button, candidate result cards with Fit Score, strengths (green tags), skill gaps (red tags)
- Leaderboard page: ranked table with Rank | Name | Fit Score | Status columns, progress bars, top candidate highlighted
- Candidate Detail page: strengths, skill gaps, explanation, "AI Career Gap Intelligence" roadmap section with timeline, estimated days, suggested skills
- 5 demo candidates with pre-computed fit scores, strengths, skill gaps
- 2 demo job descriptions
- Backend store: candidates, job descriptions, match results
- Backend APIs: getCandidates, getJobDescriptions, matchCandidates (simulated scoring), getCandidateDetail

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Motoko actor with candidate store, job description store, match/scoring logic (deterministic algorithm, no real AI needed for MVP)
2. Frontend pages: Landing, Upload, Match Dashboard, Leaderboard, Candidate Detail
3. Navigation between pages using React Router
4. Demo data pre-loaded
5. Color system: green (#22c55e) = strong, yellow (#eab308) = medium, red (#ef4444) = weak
6. UI: white background, rounded-2xl cards, soft shadows, lots of whitespace
