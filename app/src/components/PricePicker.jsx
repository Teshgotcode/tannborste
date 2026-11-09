import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { MODELS } from "../content.js";

const fmt = (n) => n.toLocaleString("nb-NO").replace(/\u00a0/g, " ");

const ICONS = {
  handle: (
    <svg viewBox="0 0 40 56" aria-hidden="true">
      <rect x="13" y="16" width="14" height="36" rx="7" />
      <circle cx="20" cy="11" r="6" />
      <path d="M17 36h6" />
    </svg>
  ),
  head: (
    <svg viewBox="0 0 40 56" aria-hidden="true">
      <circle cx="20" cy="18" r="9" />
      <path d="M11 12v-5M15 9V4M20 8V3M25 9V4M29 12v-5" />
      <rect x="16" y="27" width="8" height="24" rx="4" />
    </svg>
  ),
  stand: (
    <svg viewBox="0 0 40 56" aria-hidden="true">
      <ellipse cx="20" cy="45" rx="14" ry="5" />
      <path d="M6 45v-6M34 45v-6M14 39h12" />
      <path d="M20 39v-9" />
      <circle cx="20" cy="26" r="4" />
    </svg>
  ),
  case: (
    <svg viewBox="0 0 40 56" aria-hidden="true">
      <rect x="8" y="11" width="24" height="37" rx="11" />
      <path d="M20 22l-4 8h8l-4 8" />
    </svg>
  ),
  holder: (
    <svg viewBox="0 0 40 56" aria-hidden="true">
      <path d="M10 47V29a10 10 0 0 1 20 0v18" />
      <circle cx="16" cy="31" r="2.6" />
      <circle cx="24" cy="31" r="2.6" />
    </svg>
  ),
};

const LABELS = {
  handle: "Håndtak",
  head: "Hoder",
  stand: "Ladere",
  case: "Etui",
  holder: "Hodeholder",
};

export default function PricePicker() {
  const [model, setModel] = useState("duo");
  const m = MODELS[model];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const mv = useMotionValue(0);
  const amountText = useTransform(mv, (v) => fmt(Math.round(v)) + " kr");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, m.amount, {
      duration: reduce ? 0 : 0.9,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, m.amount, mv, reduce]);

  const [prev, setPrev] = useState(MODELS.duo.counts);
  const changed = Object.keys(m.counts).filter((k) => m.counts[k] !== prev[k]);
  useEffect(() => setPrev(m.counts), [m.counts]);

  return (
    <div className="instrument" ref={ref}>
      <div className="seg" role="group" aria-label="Velg pakke">
        <button type="button" data-model="duo" aria-pressed={model === "duo"} onClick={() => setModel("duo")}>
          Duo-pakken
        </button>
        <button type="button" data-model="two" aria-pressed={model === "two"} onClick={() => setModel("two")}>
          To enkeltbørster
        </button>
      </div>

      <div className="receipt">
        <div>
          <motion.div className="amount" aria-live="polite">
            {amountText}
          </motion.div>
          <div className="sub">
            {m.per} · <b>{fmt(m.amount - m.cashback)} kr etter cashback</b>
          </div>
        </div>
        <ul className="boxlist">
          {m.box.map(([label, n]) => (
            <li key={label}>
              <span>{label}</span>
              <b>{n}</b>
            </li>
          ))}
        </ul>
      </div>

      <div className="tiles">
        {Object.keys(m.counts).map((key) => (
          <div className={"tile" + (changed.includes(key) ? " changed" : "")} key={key}>
            {ICONS[key]}
            <span className="n">{m.counts[key]}</span>
            <span className="l">{LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
