import { Fragment, useEffect, useRef, useState } from "react";

export default function SplitText({
  text = "",
  as = "p",
  className = "",
  delay = 0,
  stagger = 0.045,
}) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = String(text).split(" ").filter(Boolean);

  return (
    <Tag ref={ref} className={"st " + className + (on ? " st-in" : "")} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i + w}>
          <span className="st-w" aria-hidden="true">
            <span
              className="st-i"
              style={{ transitionDelay: (delay + i * stagger).toFixed(3) + "s" }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
