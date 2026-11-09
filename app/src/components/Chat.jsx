import { useEffect, useMemo, useRef, useState } from "react";
import { CORPUS } from "../content.js";

const STOP = new Set(
  "jeg du det er og å i på for med til av en et den de som kan har hva hvordan hvor når om ikke min mitt vi dere seg fra men så ut deg hun han denne dette noe noen mye mer mest blir ble være var skal vil må hvis at også bare da nå her der".split(" ")
);

const norm = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ");
const tokens = (s) =>
  norm(s)
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

function buildIndex() {
  const docs = CORPUS.map((item) => {
    const toks = tokens(item.q.join(" ") + " " + item.a + " " + item.src);
    const tf = {};
    toks.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
    return { item, tf, len: toks.length };
  });
  const df = {};
  docs.forEach((d) => Object.keys(d.tf).forEach((t) => (df[t] = (df[t] || 0) + 1)));
  const avg = docs.reduce((s, d) => s + d.len, 0) / docs.length;
  const K1 = 1.4;
  const B = 0.72;
  return (query) => {
    const qs = tokens(query);
    if (!qs.length) return [];
    const scored = docs.map((d) => {
      let s = 0;
      qs.forEach((t) => {
        const f = d.tf[t] || 0;
        if (!f) return;
        const idf = Math.log(1 + (docs.length - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5));
        s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * d.len / avg)));
      });
      return { item: d.item, s };
    });
    scored.sort((a, b) => b.s - a.s);
    return scored.filter((x) => x.s > 1.2);
  };
}

const SUGGESTIONS = [
  "Er den verdt prisen?",
  "Hvor lenge holder batteriet?",
  "Kan jeg lade med USB-C?",
  "Hva koster hodene i året?",
  "Er den grei for tannkjøttet mitt?",
];

const FALLBACK =
  "Det står ikke i kildene jeg har, så jeg vil ikke gjette. Prøv noe om pris, batteri, rengjøring, tannkjøtt, reise eller hva anmelderne klager på.";

export default function Chat() {
  const search = useMemo(buildIndex, []);
  const [msgs, setMsgs] = useState([
    {
      who: "bot",
      text: "Hei. Spør meg om pris, batteri, tannkjøtt, reise eller hva anmelderne klager på. Jeg svarer bare med det som står i kildene.",
      src: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const ask = (raw) => {
    const q = (raw || "").trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { who: "me", text: q }]);
    setInput("");
    setTyping(true);
    timer.current = setTimeout(() => {
      const hits = search(q);
      let text = FALLBACK;
      let src = "Ingen treff i de 30 kildene";
      if (hits.length) {
        const top = hits[0];
        const second = hits[1] && hits[1].s > top.s * 0.72 ? hits[1].item : null;
        text = top.item.a + (second ? " " + second.item.a : "");
        src = top.item.src + (second ? " · " + second.item.src : "");
      }
      setTyping(false);
      setMsgs((m) => [...m, { who: "bot", text, src }]);
    }, 480);
  };

  return (
    <div className="chat">
      <div className="chat-head">
        <span className="who">
          <b>Spørreassistent</b> · {CORPUS.length} kilder
        </span>
        <span className="badge">Ingen salgsspråk</span>
      </div>

      <div className="log" id="log" ref={logRef}>
        {msgs.map((m, i) => (
          <div key={i} className={"msg " + m.who}>
            <div className="bubble">
              {m.text}
              {m.src && <span className="src">Kilde: {m.src}</span>}
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg bot">
            <div className="bubble">
              <span className="typing">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="suggest">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => ask(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        autoComplete="off"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv et spørsmål …"
          aria-label="Spørsmål"
        />
        <button type="submit">Spør</button>
      </form>
    </div>
  );
}
