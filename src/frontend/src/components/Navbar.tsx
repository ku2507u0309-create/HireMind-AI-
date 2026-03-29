import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const links = [
    { label: "Platform", href: "/" as const },
    { label: "Upload", href: "/upload" as const },
    { label: "Match", href: "/match" as const },
    { label: "Leaderboard", href: "/leaderboard" as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#22C55E" }}
          >
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-brand-heading font-bold text-lg tracking-tight">
            HireMind AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              data-ocid="nav.link"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === link.href
                  ? "text-green-600 bg-green-50"
                  : "text-brand-body hover:text-brand-heading hover:bg-brand-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate({ to: "/upload" })}
            data-ocid="nav.primary_button"
            className="text-sm font-semibold text-white rounded-xl px-5 h-9"
            style={{ background: "#22C55E" }}
          >
            Start Matching
          </Button>
        </div>
      </div>
    </header>
  );
}
