import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-brand-subtle border-t border-brand-border mt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "#22C55E" }}
              >
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="text-brand-heading font-bold text-base">
                HireMind AI
              </span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              AI-powered hiring intelligence for modern talent teams.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-brand-heading mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              {[
                "Resume Analysis",
                "Smart Matching",
                "Career Intelligence",
                "Leaderboard",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-brand-muted hover:text-brand-body cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-brand-heading mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-brand-muted hover:text-brand-body cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-brand-heading mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Security"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-brand-muted hover:text-brand-body cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-brand-muted">
            © {year} HireMind AI. All rights reserved.
          </p>
          <p className="text-sm text-brand-muted">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-body transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
