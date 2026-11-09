import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let instance = null;

export const getLenis = () => instance;

export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1.02,
      smoothWheel: true,
    });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}
