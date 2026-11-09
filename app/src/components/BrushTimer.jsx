import { useEffect, useRef, useState } from "react";

const TOTAL = 120;
const QUADS = ["Øvre høyre", "Øvre venstre", "Nedre venstre", "Nedre høyre"];
const C = 2 * Math.PI * 86;

function mmss(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

export default function BrushTimer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pressure, setPressure] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  const quadRef = useRef(0);
  const audioRef = useRef(null);

  const beep = (freq, vol) => {
    try {
      audioRef.current =
        audioRef.current ||
        new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g).connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      o.stop(ctx.currentTime + 0.24);
    } catch (e) {
      /* no audio, no problem */
    }
  };

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed * 1000;
    const id = setInterval(() => {
      const s = (performance.now() - startRef.current) / 1000;
      if (s >= TOTAL) {
        setElapsed(TOTAL);
        setRunning(false);
        setDone(true);
        beep(880, 0.07);
        return;
      }
      setElapsed(s);
      const q = Math.floor(s / 30);
      if (q !== quadRef.current) {
        quadRef.current = q;
        beep(620, 0.04);
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const left = TOTAL - elapsed;
  const progress = Math.min(1, elapsed / TOTAL);
  const quad = Math.min(3, Math.floor(elapsed / 30));
  const tone = pressure ? "#B0452B" : done ? "#3D5844" : "#14120D";

  const start = () => {
    setDone(false);
    setRunning(true);
    if (elapsed === 0) beep(520, 0.03);
  };
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setDone(false);
    quadRef.current = 0;
  };

  return (
    <div className={"brushlab" + (pressure ? " pressured" : "")}>
      <div className="brush-ring">
        <svg viewBox="0 0 200 200" role="img" aria-label={"Tannpuss-timer, " + mmss(left) + " igjen"}>
          <circle cx="100" cy="100" r="86" className="ring-track" />
          <circle
            cx="100"
            cy="100"
            r="86"
            className="ring-fill"
            style={{
              stroke: tone,
              strokeDasharray: C,
              strokeDashoffset: C * (1 - progress),
            }}
          />
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1="100" y1="8" x2="100" y2="16" className="ring-tick" transform={"rotate(" + a + " 100 100)"} />
          ))}
        </svg>
        <div className="brush-center">
          <span className="brush-time">{mmss(left)}</span>
          <span className="brush-quad">
            {done ? "Ferdig" : pressure ? "For hardt" : QUADS[quad]}
          </span>
        </div>
      </div>

      <div className="brush-side">
        <p className="brush-lede">
          {done
            ? "To minutter. Fire soner. Det er hele jobben."
            : "Prøv den. To minutter, fire soner, og en sensor som sier fra når du presser for hardt."}
        </p>

        <div className="brush-actions">
          <button type="button" className="btn-dark" onClick={running ? () => setRunning(false) : start}>
            {running ? "Pause" : elapsed > 0 && !done ? "Fortsett" : "Start"}
          </button>
          {elapsed > 0 && (
            <button type="button" className="btn-ghost" onClick={reset}>
              Nullstill
            </button>
          )}
          <button
            type="button"
            className={"btn-press" + (pressure ? " on" : "")}
            onPointerDown={() => setPressure(true)}
            onPointerUp={() => setPressure(false)}
            onPointerLeave={() => setPressure(false)}
            onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setPressure(true)}
            onKeyUp={() => setPressure(false)}
          >
            Hold for å presse hardt
          </button>
        </div>

        <div className="brush-quads">
          {QUADS.map((q, i) => (
            <div key={q} className={"bq" + (i < quad || (done && i <= 3) ? " done" : "") + (i === quad && !done ? " now" : "")}>
              <span />
              {q}
            </div>
          ))}
        </div>

        <p className="brush-note">
          {pressure
            ? "Sensoren skrur ned farten og lyser rødt. Det er denne delen som er verdt noe for tannkjøttet."
            : "Børsten gjør nøyaktig dette selv. Du trenger ikke tenke på det, men du kan se det her."}
        </p>
      </div>
    </div>
  );
}
