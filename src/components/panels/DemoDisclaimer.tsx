import type { MouseEvent } from "react";
import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t, tList } from "../../i18n";

/** Data-honesty modal: states this is a simulated demo environment. */
export function DemoDisclaimer() {
  const lang = useCommandCenterStore((s) => s.lang);
  const show = useCommandCenterStore((s) => s.showDisclaimer);
  const close = useCommandCenterStore((s) => s.closeDisclaimer);

  if (!show) return null;

  return (
    <div className="modal-scrim" onClick={close}>
      <div className="modal glass" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <h2>{t("disclaimerTitle", lang)}</h2>
        <div className="m-sub">{t("demoMode", lang)}</div>
        <ul>
          {tList("disclaimers", lang).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
        <p style={{ marginTop: 20, fontSize: 11.5, lineHeight: 1.6, color: "var(--muted)" }}>
          {t("footer", lang)}
        </p>
        <div style={{ marginTop: 18, textAlign: "right" }}>
          <button className="btn primary" onClick={close}>
            {t("disclaimerUnderstood", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
