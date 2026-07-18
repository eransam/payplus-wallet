import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** בכל מעבר בין דפים — גולל לראש (חלון + אזור התוכן אם הוא זה שגולל) */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const main = document.querySelector(".app-main");
    if (main instanceof HTMLElement) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
