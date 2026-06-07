import type { CopilotReport } from "../../types/ai";

function levelClass(level: string): string {
  if (level === "Critical" || level === "High") return "score-bad";
  if (level === "Elevated") return "score-warn";
  return "score-good";
}

/** Renders a deterministic copilot report as titled key/value lines. */
export function CopilotResponseCard({ report }: { report: CopilotReport }) {
  const lvlClass = levelClass(report.level);
  return (
    <div>
      <div className="report-title">{report.title}</div>
      {report.lines.map((ln, i) => (
        <div className="report-line" key={i}>
          <div className="rk">{ln.k}</div>
          <div className="rv">
            {ln.lvl ? <span className={"lvl " + lvlClass}>{ln.v}</span> : ln.v}
          </div>
        </div>
      ))}
    </div>
  );
}
