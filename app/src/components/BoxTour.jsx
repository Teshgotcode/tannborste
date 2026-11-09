import { useEffect, useRef, useState } from "react";
import { PARTS } from "../content.js";
import Reveal from "./Reveal.jsx";

const HERO = import.meta.env.BASE_URL + "img/hero-1200.webp";

export default function BoxTour() {
  const [active, setActive] = useState(PARTS[0].id);
  const stepRefs = useRef({});
  const part = PARTS.find((p) => p.id === active) || PARTS[0];

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.dataset.part);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.values(stepRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="tour">
      <div className="tour-fig">
        <div className="tour-frame">
          <img src={HERO} alt="Oral-B iO9 Duo: to håndtak, tre børstehoder, magnetlader og ladeetui" width="1200" height="1200" loading="lazy" />
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={
                "hot" + (active === p.id ? " on" : "") + (p.x > 64 ? " flip" : "")
              }
              style={{ left: p.x + "%", top: p.y + "%" }}
              onClick={() => setActive(p.id)}
              aria-label={p.label + ", " + p.count}
              aria-pressed={active === p.id}
            >
              <span className="hot-dot" aria-hidden="true" />
              <span className="hot-label" aria-hidden="true">
                {p.label} <b>{p.count}</b>
              </span>
            </button>
          ))}
        </div>
        <p className="tour-cap" aria-live="polite">
          Del {String(PARTS.findIndex((p) => p.id === part.id) + 1).padStart(2, "0")} av 05
        </p>
      </div>

      <div className="tour-steps">
        {PARTS.map((p, i) => (
          <article
            key={p.id}
            data-part={p.id}
            ref={(el) => (stepRefs.current[p.id] = el)}
            className={"tour-step" + (active === p.id ? " on" : "")}
            onClick={() => setActive(p.id)}
          >
            <div className="tour-num">{String(i + 1).padStart(2, "0")} / 05</div>
            <h3>{p.label}</h3>
            <p>{p.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
