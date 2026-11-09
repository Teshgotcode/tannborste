import { useEffect, useRef, useState } from "react";

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uPtr;
uniform float uTime;
uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  float t = uTime * 0.018;

  vec2 q = vec2(fbm(p * 1.35 + vec2(0.0, t)), fbm(p * 1.35 + vec2(4.7, -t)));
  vec2 r = vec2(fbm(p * 2.05 + q * 1.25 + vec2(t * 1.6, 0.0)),
                fbm(p * 2.05 + q * 1.25 + vec2(0.0, t * 1.25)));
  float f = fbm(p * 1.05 + r * 1.55 + vec2(0.0, uScroll * 0.45));

  vec3 paper = vec3(0.973, 0.957, 0.922);
  vec3 rust  = vec3(0.690, 0.271, 0.169);
  vec3 moss  = vec3(0.239, 0.345, 0.267);
  vec3 gold  = vec3(0.627, 0.494, 0.208);

  vec3 col = paper;
  col = mix(col, rust, smoothstep(0.30, 0.88, f) * 0.20);
  col = mix(col, moss, smoothstep(0.44, 0.96, q.x) * 0.12);
  col = mix(col, gold, smoothstep(0.50, 1.0, r.y) * 0.10);

  float ar = uRes.x / uRes.y;
  vec2 b1 = vec2(0.20 + 0.09 * sin(t * 0.9), 0.16 + 0.07 * cos(t * 0.7));
  vec2 b2 = vec2(0.84 + 0.07 * cos(t * 0.6), 0.86 + 0.06 * sin(t * 0.8));
  float d1 = length((uv - b1) * vec2(ar, 1.0));
  float d2 = length((uv - b2) * vec2(ar, 1.0));
  col = mix(col, rust, exp(-d1 * d1 * 2.0) * 0.17);
  col = mix(col, gold, exp(-d2 * d2 * 2.4) * 0.13);

  vec2 pc = (uPtr - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float d = length(p - pc);
  col += vec3(1.0, 0.985, 0.95) * exp(-d * d * 2.4) * 0.05;

  float vig = smoothstep(1.3, 0.2, length(p));
  col *= mix(0.955, 1.0, vig);

  float g = hash(gl_FragCoord.xy + fract(uTime) * vec2(31.0, 17.0));
  col += (g - 0.5) * 0.020;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function AmbientField() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      setReady(true);
      return;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("shader", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setReady(true);
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uPtr = gl.getUniformLocation(prog, "uPtr");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      px: 0.5,
      py: 0.5,
      tx: 0.5,
      ty: 0.5,
      time: 0,
      scroll: 0,
    };

    const resize = () => {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.w = window.innerWidth;
      state.h = window.innerHeight;
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let last = performance.now();

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      state.time += dt;
      state.px += (state.tx - state.px) * 0.045;
      state.py += (state.ty - state.py) * 0.045;
      state.scroll +=
        ((window.scrollY || 0) / Math.max(1, document.body.scrollHeight - window.innerHeight) -
          state.scroll) *
        0.06;

      gl.uniform2f(uPtr, state.px, state.py);
      gl.uniform1f(uTime, state.time);
      gl.uniform1f(uScroll, state.scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!calm) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      state.tx = e.clientX / window.innerWidth;
      state.ty = 1 - e.clientY / window.innerHeight;
    };

    const onVisible = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !calm) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 150);
    };

    resize();
    raf = requestAnimationFrame(draw);
    setReady(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisible);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="amb" aria-hidden="true">
      <div className="amb-fallback" />
      <canvas ref={canvasRef} className={"amb-canvas" + (ready ? " ready" : "")} />
    </div>
  );
}
