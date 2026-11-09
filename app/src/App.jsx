import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll, getLenis } from "./lib/smooth.js";
import AmbientField from "./components/AmbientField.jsx";
import Cursor from "./components/Cursor.jsx";
import SplitText from "./components/SplitText.jsx";
import "./ambient-field.css";
import "./motion.css";
import PricePicker from "./components/PricePicker.jsx";
import BoxTour from "./components/BoxTour.jsx";
import BrushTimer from "./components/BrushTimer.jsx";
import Chat from "./components/Chat.jsx";
import { CostCalc, TripCalc } from "./components/Costs.jsx";
import Reveal from "./components/Reveal.jsx";
import { REVIEWS } from "./content.js";

const HERO = import.meta.env.BASE_URL + "img/hero-1200.webp";
const HERO_SMALL = import.meta.env.BASE_URL + "img/hero-760.jpg";

const SECTIONS = [
  ["prisen", "Prisen"],
  ["elektrisk", "Elektrisk"],
  ["tannkjott", "Tannkjøtt"],
  ["anmeldelser", "Anmeldelser"],
  ["prov", "Prøv"],
  ["aarskostnad", "Årskostnad"],
  ["reise", "Reise"],
  ["spor", "Spør"],
];

function Count({ to, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setV(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span className={className} ref={ref}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

function SectionHead({ n, title }) {
  return (
    <div className="sec-head">
      <div className="sec-num">{n}</div>
      <SplitText as="h2" text={title} />
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState("prisen");
  const [pastCover, setPastCover] = useState(false);
  const [chatInView, setChatInView] = useState(false);
  const [intro, setIntro] = useState(true);
  const [introIn, setIntroIn] = useState(false);
  const rootRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollY, scrollYProgress } = useScroll();

  const rx = useSpring(0, { stiffness: 110, damping: 16 });
  const ry = useSpring(0, { stiffness: 110, damping: 16 });

  useSmoothScroll(!reduce);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    const a = setTimeout(() => setIntroIn(true), 80);
    const b = setTimeout(() => setIntro(false), 1000);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setPastCover(y > window.innerHeight * 0.85);
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const chat = document.getElementById("spor");
    const io2 = new IntersectionObserver((es) => setChatInView(es[0].isIntersecting), {
      threshold: 0.15,
    });
    if (chat) io2.observe(chat);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".cover-fig", {
        yPercent: -9,
        scale: 0.9,
        rotate: -1.4,
        ease: "none",
        scrollTrigger: { trigger: ".cover", start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(".cover-text", {
        yPercent: -7,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: { trigger: ".cover", start: "top top", end: "72% top", scrub: 0.6 },
      });

      const inner = rootRef.current.querySelector(".marquee-inner");
      if (inner) {
        gsap.to(inner, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  const go = (e, id) => {
    const lenis = getLenis();
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo("#" + id, { offset: -24, duration: 1.35 });
  };

  const tilt = (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 9);
    rx.set(-py * 9);
  };
  const untilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const idx = SECTIONS.findIndex(([id]) => id === active);

  return (
    <div className="page" ref={rootRef}>
      <AmbientField />
      <Cursor />

      <div className={"intro" + (introIn ? " show" : "") + (intro ? "" : " done")} aria-hidden="true">
        <span>Oral-B iO9 Duo · 2 990 kr</span>
      </div>
      <div className="grain" aria-hidden="true" />

      <motion.div className="progress" aria-hidden="true">
        <motion.i style={{ scaleX: scrollYProgress }} />
      </motion.div>

      <div className={"chap" + (pastCover ? " show" : "")} aria-hidden="true">
        <b>{String(Math.max(idx, 0) + 1).padStart(2, "0")}</b>
        <span>/ 08</span>
      </div>

      <nav className="rail" aria-label="Kapitler">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={"#" + id}
            className={active === id ? "on" : ""}
            aria-label={label}
            data-cursor="link"
            onClick={(e) => go(e, id)}
          >
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <header className={"cover" + (ready ? " ready" : "")} id="top">
        <div className="cover-inner">
          <div className="cover-text">
            <div className="kicker">
              <span className="dot" />
              En side laget for deg
              <span className="sep" style={{ opacity: 0.35 }}>
                /
              </span>
              <span className="date">9. november 2026</span>
            </div>
            <h1 className="display">
              <span className="mask">
                <span>Tannbørsten,</span>
              </span>
              <span className="mask d1">
                <span>
                  <em>forklart.</em>
                </span>
              </span>
            </h1>
            <p className="lede">
              Du spurte om den var verdt det. Her er <strong>hele svaret</strong>, uten salgsspråk.
            </p>
            <div className="cover-meta">
              <span>
                <b>2 990 kr</b>
              </span>
              <span className="sep">/</span>
              <span>2 790 etter cashback</span>
              <span className="sep sm-hide">/</span>
              <span className="sm-hide">to børster</span>
            </div>
            <div className="cover-verdict">
              <span>Kort svar</span>
              <p>
                Ja, for dere to. <b>Nei</b>, for én.
              </p>
            </div>
            <div className="scroll-cue">
              <i />
              Bla ned
            </div>
          </div>

          <motion.figure className="cover-fig" onPointerMove={tilt} onPointerLeave={untilt}>
            <motion.div
              className="fig-inner"
              style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
            >
              <div className="plate">
                <picture>
                  <source media="(min-width:700px)" srcSet={HERO} type="image/webp" />
                  <img
                    src={HERO_SMALL}
                    alt="Oral-B iO9 Duo: to håndtak i svart og rose, tre børstehoder, magnetlader og ladeetui"
                    width="1200"
                    height="1200"
                    fetchPriority="high"
                  />
                </picture>
                <span className="sheen" aria-hidden="true" />
              </div>
            </motion.div>
            <figcaption>
              <span>Fig. 1 · Slik kommer den: to håndtak, tre hoder, lader og etui</span>
            </figcaption>
          </motion.figure>
        </div>
      </header>

      <main>
        <section className="wrap" id="prisen">
          <SectionHead n="01" title="Regnestykket" />
          <Reveal className="body">
            <p className="dropcap">
              En iO9 alene koster 1 990 kr. To koster 3 998 kr. Duo-pakken koster 2 990 kr og
              inneholder begge. Du sparer nesten tusen kroner på å kjøpe dem sammen, selv om dere
              bor på hver deres kant.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div style={{ marginTop: 26 }}>
              <PricePicker />
            </div>
          </Reveal>
          <Reveal>
            <p className="aside">
              Trykk på punktene i bildet for å se hva som faktisk ligger i esken.
            </p>
          </Reveal>
          <BoxTour />
        </section>

        <div className="quote-band">
          <div className="wrap">
            <Reveal>
              <blockquote>
                Halvparten av gevinsten er ikke motoren. Det er at børsten <em>teller to minutter</em>{" "}
                og sier fra når du presser for hardt.
              </blockquote>
            </Reveal>
          </div>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-inner">
            {[0, 1].map((k) => (
              <span key={k}>
                To håndtak <i>·</i> Tre hoder <i>·</i> 16 soner <i>·</i> 12 dager <i>·</i> 200 kr
                tilbake <i>·</i> Trykksensor <i>·</i> 2 minutter <i>·</i>{" "}
              </span>
            ))}
          </div>
        </div>

        <section className="wrap" id="elektrisk">
          <SectionHead n="02" title="Er elektrisk verdt det i det hele tatt?" />
          <Reveal className="body">
            <p>
              Ja, men gevinsten er mindre enn reklamen vil ha det til. Cochrane har samlet over 40
              studier. Roterende børster fjerner 11 prosent mer plakk etter en til tre måneder, og
              21 prosent mer etter tre måneder. Tannkjøttbetennelse går ned 6 til 11 prosent.
            </p>
          </Reveal>
          <Reveal>
            <div className="stats">
              <div className="stat">
                <Count className="n" to={11} suffix=" %" />
                <span className="t">
                  mer plakk fjernet
                  <br />
                  etter 1 til 3 mnd
                </span>
              </div>
              <div className="stat">
                <Count className="n" to={21} suffix=" %" />
                <span className="t">
                  mer plakk fjernet
                  <br />
                  etter 3 mnd
                </span>
              </div>
              <div className="stat">
                <Count className="n" to={7} prefix="6–" suffix=" %" />
                <span className="t">
                  mindre
                  <br />
                  tannkjøttbetennelse
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="wrap" id="tannkjott">
          <SectionHead n="03" title="Og når man har lichen planus?" />
          <Reveal className="body">
            <p>
              Da er svaret sterkere. Det finnes en randomisert studie på akkurat dette. Stone og
              kolleger testet strukturert plakkontroll med elektrisk børste på 82 pasienter med
              lichen planus i tannkjøttet. Plakket sank 39,5 prosent, mot 4,1 prosent i
              kontrollgruppen. Slimhinnelesjonene ble bedre, målt etter fire og tjue uker.
            </p>
            <p>
              En annen studie sammenlignet sonisk og manuell børste ved desquamativ gingivitt.
              Elektrisk ga 82 prosent færre blødende punkter, mot 69 prosent med manuell.
            </p>
          </Reveal>

          <Reveal>
            <h3 style={{ marginTop: 36 }}>Det som faktisk hjelper</h3>
            <Checklist />
          </Reveal>
          <Reveal>
            <p className="aside">
              Trykksensoren er hele poenget her. Den lyser rødt og skrur ned farten før du gjør
              skade. Det er ikke en gadget, det er den delen som er medisinsk relevant.
            </p>
          </Reveal>
        </section>

        <section className="wrap" id="anmeldelser">
          <SectionHead n="04" title="Hva sier folk som har kjøpt den?" />
          <div className="bars">
            {REVIEWS.map((r, i) => (
              <div className="barrow" key={r.name}>
                <div className="barlabel">
                  {r.name}
                  <small>{r.sub}</small>
                </div>
                <div className="barval">{r.value}</div>
                <div className="track">
                  <motion.div
                    className="fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: r.w + "%" }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 1.1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Reveal>
            <p className="aside">
              Felles for klagene på tvers av merkene: batteriet dør etter 12 til 18 måneder. Det
              gjelder Philips også. Norsk lov gir deg fem års reklamasjonsrett, så det er en
              papirjobb, ikke et tap.
            </p>
          </Reveal>
        </section>

        <section className="wrap" id="prov">
          <SectionHead n="05" title="Prøv den, her og nå" />
          <Reveal className="body">
            <p>
              Det beste med børsten er ikke noe du ser på et bilde. Det er at den tar ansvar for
              tiden. Start timeren og se hva den gjør.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <BrushTimer />
          </Reveal>
        </section>

        <section className="wrap" id="aarskostnad">
          <SectionHead n="06" title="Hva koster den å bruke?" />
          <Reveal className="body">
            <p>
              Hodet byttes hver tredje måned. To personer trenger åtte hoder i året, altså én
              åttpakning. Den koster 449 kr på det billigste og 699 kr på fullpris.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <CostCalc />
          </Reveal>
        </section>

        <section className="wrap" id="reise">
          <SectionHead n="07" title="Reise og lading" />
          <Reveal className="body">
            <p>
              Det finnes ingen USB-C. Børsten har ingen kontakt, og laderen har fast 2-pin-støpsel.
              Den støtter 100 til 240 volt, så den går rett i veggen i hele Europa.
            </p>
            <p>Batteriet holder 12 til 14 dager. Det dekker de fleste turer.</p>
          </Reveal>
          <Reveal delay={0.05}>
            <TripCalc />
          </Reveal>
        </section>

        <section className="wrap summary">
          <h3>Kort oppsummert</h3>
          <ol>
            <li>
              <p>
                To personer: <b>kjøp Duo-pakken.</b> 2 790 kr etter cashback.
              </p>
            </li>
            <li>
              <p>
                Én person: <b>kjøp enkeltbørsten.</b> 1 990 kr.
              </p>
            </li>
            <li>
              <p>
                Tannkjøtt: <b>myke hoder og Sensitive.</b> Det er den delen som teller.
              </p>
            </li>
          </ol>
        </section>

        <section className="wrap" id="spor">
          <SectionHead n="08" title="Spør om tannbørsten" />
          <Reveal className="body">
            <p>
              En liten hjelper som bare svarer fra anmeldelser, manualen og testresultatene under.
              Den finner ikke på noe. Står det ikke i kildene, sier den det.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <Chat />
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="sources">
            <b>Kilder</b>
            <br />
            Cochrane, Powered versus manual toothbrushing, 2014 · Stone et al., J Clin Periodontol,
            2015 · Bianco et al., Int J Dent Hyg, 2019 · Test.no, oppdatert 9. nov 2026 · Elkjøp,
            Power og Komplett, priser og eskeinnhold 9. nov 2026 · Prisjakt, hoder og prishistorikk ·
            Oral-B cashback-vilkår · Electric Teeth og TechAdvisor, tester av iO9.
          </div>
          <div className="fineprint">
            Prisene er sjekket 9. november 2026 og kan endre seg. Dette er en oppsummering av
            forskning og anmeldelser, ikke medisinsk råd. Har du erosiv lichen planus, ta
            børstevalget med tannlegen eller oralmedisineren.
          </div>
          <div className="colophon">
            Satt i Instrument Serif og Newsreader. Bygget i React, for én person.
          </div>
        </div>
      </footer>

      <a
        className={"chip" + (pastCover && !chatInView ? " show" : "")}
        href="https://www.komplett.no/product/1336296/hjem-fritid/personlig-pleie/tannpleie/tilbehoer-til-tannpleie/oral-b-io9-elektrisk-tannboerste-duo-pakke-svart-og-rosa"
        target="_blank"
        rel="noopener"
        data-cursor="link"
      >
        <span className="k">2 790 kr</span>
        <span className="l">
          etter cashback
          <br />
          se hos Komplett
        </span>
      </a>
    </div>
  );
}

const CHECKS = [
  ["soft", "Myke hoder, ikke Ultimate Clean", "Gentle Care passer alle iO-håndtak"],
  ["mode", "Sensitive-modus, ikke Daily Clean", "Laveste intensitet, samme rengjøring"],
  ["paste", "Tannkrem uten SLS, mint og kanel", "Mesteparten av vanlig tannkrem irriterer"],
  ["clean", "Tannrens hver tredje til fjerde måned", "Ikke hvert halvår, som ellers"],
  ["mouth", "Unngå alkoholholdig munnvann", "Og unngå å tygge på leppen"],
];

function Checklist() {
  const [on, setOn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tb_checks") || "{}");
    } catch (e) {
      return {};
    }
  });

  const toggle = (key) => {
    const next = { ...on, [key]: !on[key] };
    setOn(next);
    try {
      localStorage.setItem("tb_checks", JSON.stringify(next));
    } catch (e) {
      /* private mode */
    }
  };

  return (
    <ul className="check">
      {CHECKS.map(([key, text, small]) => (
        <li key={key}>
          <label>
            <input type="checkbox" checked={!!on[key]} onChange={() => toggle(key)} />
            <span className="box" />
            <span className="txt">
              {text}
              <small>{small}</small>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
