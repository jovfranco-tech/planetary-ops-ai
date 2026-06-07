import { useEffect } from "react";
import { useCommandCenterStore } from "../store/useCommandCenterStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const store = useCommandCenterStore.getState();

      switch (e.key.toLowerCase()) {
        case "z":
          store.toggleZenMode();
          break;
        case "t":
          store.toggleThermalMode();
          break;
        case "c":
          store.toggleCopilot();
          break;
        case "h":
          window.dispatchEvent(new CustomEvent("gesture-rotate", { detail: { deltaX: -1.5, deltaY: 0 } }));
          break;
        case "l":
          window.dispatchEvent(new CustomEvent("gesture-rotate", { detail: { deltaX: 1.5, deltaY: 0 } }));
          break;
        case "j":
          window.dispatchEvent(new CustomEvent("gesture-rotate", { detail: { deltaX: 0, deltaY: -1.5 } }));
          break;
        case "k":
          window.dispatchEvent(new CustomEvent("gesture-rotate", { detail: { deltaX: 0, deltaY: 1.5 } }));
          break;
        case "i":
        case "+":
          window.dispatchEvent(new CustomEvent("gesture-zoom", { detail: { zoomIn: true } }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
