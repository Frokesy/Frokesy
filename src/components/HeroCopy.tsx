import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type HeroCopyProps = {
  eyebrows: string[];
  signals: string[];
};

const titleParts = [
  { text: "I design and build " },
  { text: "interaction-rich", emphasis: true },
  { text: " interfaces that stay fast, sharp, and unmistakably intentional." },
];

const ledeLines = [
  "I translate visual direction into polished frontend systems with a",
  "strong eye for motion, UI behavior, and implementation detail.",
  "My work blends product thinking, visual precision, and",
  "performance discipline to create experiences people can feel.",
];

export default function HeroCopy({ eyebrows, signals }: HeroCopyProps) {
  const prefersReducedMotion = useReducedMotion();

  const container = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "show" as const,
        variants: {
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.05,
            },
          },
        },
      };

  const item = prefersReducedMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        },
      };

  const word = prefersReducedMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: "0.45em", rotateX: -70 },
          show: {
            opacity: 1,
            y: "0em",
            rotateX: 0,
            transition: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        },
      };

  return (
    <motion.div className="hero__copy" {...container}>
      <motion.div className="hero__eyebrow-group" {...item}>
        {eyebrows.map((eyebrow) => (
          <p className="hero__eyebrow" key={eyebrow}>
            {eyebrow}
          </p>
        ))}
      </motion.div>

      <motion.h1 className="hero__title" {...item}>
        {titleParts.map((part) =>
          part.emphasis ? (
            <motion.em
              className="hero__title-emphasis"
              key={part.text}
              {...word}
            >
              {part.text}
            </motion.em>
          ) : (
            <span key={part.text}>{part.text}</span>
          ),
        )}
      </motion.h1>

      <motion.p className="hero__lede" {...item}>
        {ledeLines.map((line) => (
          <span className="hero__lede-line" key={line}>
            {line}
          </span>
        ))}
      </motion.p>

      <motion.ul className="hero__signal-list" aria-label="Core strengths" {...item}>
        {signals.map((signal, index) => (
          <motion.li key={signal} {...word} transition={{ delay: index * 0.03 }}>
            {signal}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div className="hero__actions" {...item}>
        <a className="button button--primary" href="#projects">
          View selected work
        </a>
        <a className="button button--secondary" href="#contact">
          Get in touch
        </a>
      </motion.div>
    </motion.div>
  );
}
