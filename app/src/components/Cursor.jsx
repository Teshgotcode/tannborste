import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm || !dot.current || !ring.current) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.current.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      if (!root.classList.contains("cursor-on")) root.classList.add("cursor-on");
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.current.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
      raf = requestAnimationFrame(loop);
    };

    const over = (e) => {
      const hit = e.target.closest ? e.target.closest("a,button,[role='button'],[data-cursor='link']") : null;
      ring.current.classList.toggle("big", !!hit);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cur-dot" ref={dot} aria-hidden="true" />
      <div className="cur-ring" ref={ring} aria-hidden="true" />
    </>
  );
}
