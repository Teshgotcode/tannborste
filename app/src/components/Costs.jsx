import { useState } from "react";

const fmt = (n) => n.toLocaleString("nb-NO").replace(/\u00a0/g, " ");

function Range({ label, value, min, max, onChange, display }) {
  return (
    <div className="field">
      <div className="row">
        <span>{label}</span>
        <b>{display}</b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
}

export function CostCalc() {
  const [people, setPeople] = useState(2);
  const [months, setMonths] = useState(3);
  const heads = people * Math.round(12 / months);
  const low = Math.round(heads * 56.1);
  const high = Math.round(heads * 87.4);

  return (
    <div className="instrument calc">
      <Range label="Personer" value={people} min={1} max={2} onChange={setPeople} display={people} />
      <Range
        label="Bytte hode hver"
        value={months}
        min={2}
        max={4}
        onChange={setMonths}
        display={months + " mnd"}
      />
      <div className="result">
        <span className="n">{fmt(low)} kr</span>
        <span className="u">per år</span>
        <span className="note">
          {heads} hoder i året. {fmt(low)} kr på laveste pris, {fmt(high)} kr på fullpris.
        </span>
      </div>
    </div>
  );
}

export function TripCalc() {
  const [days, setDays] = useState(7);
  let head = "La laderen ligge hjemme.";
  let note = "Lad fullt kvelden før. To uker er innenfor rekkevidde.";
  if (days > 14) {
    head = "Ta med pucken.";
    note = "2-pin-støpselet virker i hele Europa. Utenfor Europa trenger du pluggadapter, ikke spenningstransformator.";
  } else if (days > 10) {
    head = "Lad fullt, og ta med pucken hvis du er usikker.";
    note = "Du ligger på grensen av batteritiden. Pucken veier lite.";
  }

  return (
    <div className="instrument calc">
      <Range
        label="Hvor lenge er du borte?"
        value={days}
        min={1}
        max={30}
        onChange={setDays}
        display={days + (days === 1 ? " dag" : " dager")}
      />
      <div className="result">
        <span className="n" style={{ fontSize: "clamp(23px,4.6vw,30px)", letterSpacing: "-.01em" }}>
          {head}
        </span>
        <span className="note">{note}</span>
      </div>
    </div>
  );
}
