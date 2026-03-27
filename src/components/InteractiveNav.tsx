import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type NavItem = {
  href: string;
  label: string;
  number: string;
};

type InteractiveNavProps = {
  items: NavItem[];
};

export default function InteractiveNav({ items }: InteractiveNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.href ?? "#about");
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.18,
  });

  const sectionIds = useMemo(
    () => items.map((item) => item.href.replace("#", "")).filter(Boolean),
    [items],
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target?.id) {
          setActiveId(`#${visibleEntries[0].target.id}`);
        }
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.04) {
      setActiveId(items[0]?.href ?? "#about");
    }
  });

  return (
    <div className="site-nav-shell">
      <motion.div
        aria-hidden="true"
        className="scroll-progress"
        style={{ scaleX: prefersReducedMotion ? scrollYProgress : progress }}
      />

      <nav className="site-nav" aria-label="Primary">
        {items.map((item) => {
          const isActive = activeId === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="site-nav__number">{item.number}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
