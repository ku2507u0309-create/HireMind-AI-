import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/AppContext";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MatchDashboard from "./pages/MatchDashboard";
import UploadPage from "./pages/UploadPage";

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <Navbar />
      <Outlet />
    </AppProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadPage,
});

const matchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/match",
  component: MatchDashboard,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const candidateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/$id",
  component: CandidateDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  uploadRoute,
  matchRoute,
  leaderboardRoute,
  candidateRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
