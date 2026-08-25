import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function PageExperience() {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);
  const [pupils, setPupils] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const shouldDark = saved === "dark";
    setDark(shouldDark);
    document.documentElement.dataset.theme = shouldDark ? "dark" : "light";

    const timer = window.setTimeout(() => setLoading(false), reduced ? 80 : 1200);
    const onPointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPupils({ x: Math.max(-4, Math.min(4, x * 5)), y: Math.max(-4, Math.min(4, y * 5)) });
    };
    const onScroll = () => {
      if (matchMedia("(pointer: coarse)").matches) {
        setPupils({ x: Math.sin(window.scrollY / 260) * 4, y: Math.cos(window.scrollY / 380) * 3 });
      }
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".case__visual"));
    const cleanups = cards.map((card) => {
      const move = (event: PointerEvent) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${((event.clientX - box.left) / box.width) * 100}%`);
        card.style.setProperty("--mouse-y", `${((event.clientY - box.top) / box.height) * 100}%`);
        card.style.setProperty("--tilt-x", `${((event.clientY - box.top) / box.height - 0.5) * -5}deg`);
        card.style.setProperty("--tilt-y", `${((event.clientX - box.left) / box.width - 0.5) * 5}deg`);
      };
      card.addEventListener("pointermove", move);
      return () => card.removeEventListener("pointermove", move);
    });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("pointermove", onPointer); window.removeEventListener("scroll", onScroll); cleanups.forEach((cleanup) => cleanup()); };
  }, [reduced]);

  const toggleTheme = async () => {
    const next = !dark;
    const root = document.documentElement;
    const rect = themeButtonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const applyTheme = () => {
      setDark(next);
      root.dataset.theme = next ? "dark" : "light";
      localStorage.setItem("portfolio-theme", next ? "dark" : "light");
    };

    type ViewTransitionDocument = Document & { startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> } };
    const transitionDocument = document as ViewTransitionDocument;
    if (reduced || !transitionDocument.startViewTransition) { applyTheme(); return; }

    root.classList.add("theme-is-changing");
    const transition = transitionDocument.startViewTransition(applyTheme);
    await transition.ready;
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 760, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)" },
    );
    await transition.finished;
    root.classList.remove("theme-is-changing");
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" initial={{ opacity: 1 }} exit={{ y: "-100%" }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}>
            <motion.div className="loader__mark" initial={{ scale: 0.72, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>AA<span>®</span></motion.div>
            <div className="loader__track"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }} /></div>
            <p>Building the experience</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button ref={themeButtonRef} className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
        <span>{dark ? "☀" : "◐"}</span><small>{dark ? "Light" : "Dark"}</small>
      </button>

      <motion.div className="rabbit" aria-hidden="true" initial={{ y: 80 }} animate={{ y: loading ? 80 : 0 }} transition={{ delay: 0.25, type: "spring", stiffness: 130, damping: 14 }}>
        <span className="rabbit__ear rabbit__ear--left" /><span className="rabbit__ear rabbit__ear--right" />
        <div className="rabbit__head">
          <div className="rabbit__eye"><i style={{ transform: `translate(${pupils.x}px, ${pupils.y}px)` }} /></div>
          <div className="rabbit__eye"><i style={{ transform: `translate(${pupils.x}px, ${pupils.y}px)` }} /></div>
          <b>•</b>
        </div>
      </motion.div>
    </>
  );
}
