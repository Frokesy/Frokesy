import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollDirector() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay: 1.05, defaults: { ease: "power4.out" } });
      intro
        .from(".site-header", { y: -40, opacity: 0, duration: 0.75 })
        .from(".hero__status", { y: 18, opacity: 0, duration: 0.55 }, "<0.1")
        .from(".hero h1 > *", { yPercent: 115, opacity: 0, rotate: 2, stagger: 0.1, duration: 1 }, "<")
        .from(".hero__sculpture", { scale: 0.58, rotate: -24, opacity: 0, duration: 1.2 }, "<0.12")
        .from(".hero__bottom > *", { y: 28, opacity: 0, stagger: 0.1, duration: 0.7 }, "<0.25");

      gsap.utils.toArray<HTMLElement>("[data-gsap-section]").forEach((section) => {
        const rule = section.querySelector<HTMLElement>(".section-rule__fill");
        const heading = section.querySelector<HTMLElement>(".section-heading h2");

        if (rule) {
          gsap.fromTo(rule, { scaleX: 0 }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 82%", end: "top 28%", scrub: 0.7 },
          });
        }

        if (heading) {
          gsap.fromTo(heading, { backgroundPositionX: "100%" }, {
            backgroundPositionX: "0%",
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 75%", end: "top 32%", scrub: 0.8 },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>(".case").forEach((card) => {
        const visual = card.querySelector<HTMLElement>(".ui-art, .case__visual img");
        if (!visual) return;
        gsap.fromTo(visual, { yPercent: 9, rotateX: 5 }, {
          yPercent: -5,
          rotateX: -2,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });

        const copyItems = card.querySelectorAll(".case__copy > *, .case__head > *");
        gsap.from(copyItems, {
          y: 34,
          opacity: 0,
          stagger: 0.07,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 72%", toggleActions: "play none none reverse" },
        });
      });

      gsap.to(".hero__sculpture", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
      });

      gsap.to(".marquee div", {
        xPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.5 },
      });

      gsap.utils.toArray<HTMLElement>(".metrics strong").forEach((metric, index) => {
        gsap.from(metric, {
          y: 50 + index * 12,
          rotate: index % 2 ? 3 : -3,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: metric, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

    });

    return () => context.revert();
  }, []);

  return null;
}
