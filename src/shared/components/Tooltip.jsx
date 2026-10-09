import { useState, useCallback, createContext, useContext, useRef, useLayoutEffect, useEffect } from "react";

const TooltipContext = createContext(null);
const MARGIN = 8;

export function TooltipProvider({ children }) {
  const [tooltip, setTooltip] = useState(null);
  const [pos, setPos] = useState(null);
  const hideTimer = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltipAtElement = useCallback((el, content) => {
    clearTimeout(hideTimer.current);
    const rect = el.getBoundingClientRect();
    setTooltip({ anchorRect: rect, content });
  }, []);

  const showTooltip = useCallback((e, content) => {
    showTooltipAtElement(e.currentTarget, content);
  }, [showTooltipAtElement]);

  const hideTooltip = useCallback(() => {
    hideTimer.current = setTimeout(() => setTooltip(null), 50);
  }, []);

  useLayoutEffect(() => {
    if (!tooltip || !tooltipRef.current) return;
    const { anchorRect } = tooltip;
    const el = tooltipRef.current;
    const { width, height } = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = anchorRect.left + anchorRect.width / 2 - width / 2;
    left = Math.max(MARGIN, Math.min(left, viewportW - width - MARGIN));

    let top = anchorRect.top - height - MARGIN;
    if (top < MARGIN) top = anchorRect.bottom + MARGIN;
    top = Math.max(MARGIN, Math.min(top, viewportH - height - MARGIN));

    setPos({ left, top });
  }, [tooltip]);

  // global interception
  useEffect(() => {
    function handleMouseOver(e) {
      const el = e.target.closest?.("[title]");
      if (!el || el.dataset.uccTooltipActive) return;
      const text = el.getAttribute("title");
      if (!text) return;
      el.dataset.uccOriginalTitle = text;
      el.removeAttribute("title");
      el.dataset.uccTooltipActive = "true";
      showTooltipAtElement(el, text);
    }

    function handleMouseOut(e) {
      const el = e.target.closest?.("[data-ucc-tooltip-active]");
      if (!el) return;
      if (el.contains(e.relatedTarget)) return;
      if (el.dataset.uccOriginalTitle) el.setAttribute("title", el.dataset.uccOriginalTitle);
      delete el.dataset.uccOriginalTitle;
      delete el.dataset.uccTooltipActive;
      hideTooltip();
    }

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [showTooltipAtElement, hideTooltip]);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <div
          ref={tooltipRef}
          className="tooltip"
          style={pos ? { left: pos.left, top: pos.top, visibility: "visible" } : { visibility: "hidden" }}
        >
          {tooltip.content}
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export const useTooltip = () => useContext(TooltipContext);