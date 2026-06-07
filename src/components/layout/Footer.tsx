import { useCommandCenterStore } from "../../store/useCommandCenterStore";
import { t, tList } from "../../i18n";

/** Subtle footer: data-honesty pills and a single portfolio credit line. */
export function Footer() {
  const lang = useCommandCenterStore((s) => s.lang);
  return (
    <div className="footer">
      <div className="disc-pills">
        {tList("disclaimers", lang).map((d, i) => (
          <div className="disc-pill" key={i}>
            <span className="d-dot" />
            {d}
          </div>
        ))}
      </div>
      <div className="footer-by">
        <b>{t("builtBy", lang)}</b>
      </div>
    </div>
  );
}
