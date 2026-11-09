import { useEffect, useRef } from "react";

export default function Magnetic({ children, strength = 0.3, max = 12, className = "" }) {
  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const allowed = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tick = () => {
    const c = cur.current;
    const t = target.current;
    c.x += (t.x - c.x) * 0.18;
    c.y += (t.y - c.y) * 0.18;
    if (ref.current) {
      ref.current.style.transform = "translate3d(" + c.x.toFixed(2) + "px," + c.y.toFixed(2) + "px,0)";
    }
    if (Math.abs(t.x - c.x) > 0.1 || Math.abs(t.y - c.y) > 0.1) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = 0;
    }
  };

  const onMove = (e) => {
    if (!allowed() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    target.current = {
      x: Math.max(-max, Math.min(max, dx)),
      y: Math.max(-max, Math.min(max, dy)),
    };
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    target.current = { x: 0, y: 0 };
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  return (
    <span
      ref={ref}
      className={"mag " + className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </span>
  );
}
