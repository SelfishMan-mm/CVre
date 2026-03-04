/**
 * WebGL2 动态背景 — Hero 区块全屏 Canvas
 * 采用 Domain Warping FBM（Inigo Quilez 技术）
 * 颜色：暗调黑底 + 品牌色 turquoise #17f1d1 微光
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),             hash(i + vec2(1,0)), f.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p  = rot * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 p = (uv * 2.0 - 1.0) * vec2(ar, 1.0);

  float t = u_time * 0.1;

  // Domain warping
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(1.7, 9.2)));
  vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7, 9.2) + t*0.15),
                fbm(p + 4.0*q + vec2(8.3, 2.8) + t*0.13));
  float f = fbm(p + 4.0 * r);

  // Dark base
  vec3 ink  = vec3(0.039, 0.039, 0.039);
  vec3 teal = vec3(0.09, 0.945, 0.82);   // #17f1d1
  vec3 purp  = vec3(0.659, 0.333, 0.969); // #a855f7

  vec3 col = mix(ink, teal * 0.10, clamp(f * f * 2.5, 0.0, 1.0));
  col = mix(col, purp * 0.06, clamp(pow(f, 3.0) * 1.5, 0.0, 1.0));

  // Subtle mouse glow
  vec2 mouse = u_mouse / u_res;
  float md = length(uv - mouse);
  col += teal * 0.06 * smoothstep(0.35, 0.0, md);

  // Vignette
  float vig = 1.0 - smoothstep(0.5, 1.3, length((uv - 0.5) * 1.6));
  col *= vig;

  fragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s))
  }
  return s
}

export function initWebGL(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    console.warn('WebGL2 not supported, skipping canvas background.')
    return () => {}
  }

  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)

  // Full-screen quad
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1,  -1,  1,
    -1,  1,  1, -1,   1,  1,
  ]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const uTime  = gl.getUniformLocation(prog, 'u_time')
  const uRes   = gl.getUniformLocation(prog, 'u_res')
  const uMouse = gl.getUniformLocation(prog, 'u_mouse')

  let mouse = { x: 0, y: 0 }
  let raf = 0
  let start = performance.now()
  let paused = false

  const resize = () => {
    canvas.width  = canvas.offsetWidth  * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  const onMouse = (e: MouseEvent) => {
    mouse = { x: e.clientX * devicePixelRatio, y: (window.innerHeight - e.clientY) * devicePixelRatio }
  }

  const render = () => {
    if (paused) { raf = requestAnimationFrame(render); return }
    const t = (performance.now() - start) / 1000
    gl.uniform1f(uTime, t)
    gl.uniform2f(uRes, canvas.width, canvas.height)
    gl.uniform2f(uMouse, mouse.x, mouse.y)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    raf = requestAnimationFrame(render)
  }

  const onVis = () => { paused = document.hidden }

  resize()
  document.addEventListener('mousemove', onMouse, { passive: true })
  document.addEventListener('visibilitychange', onVis)
  window.addEventListener('resize', resize, { passive: true })
  raf = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(raf)
    document.removeEventListener('mousemove', onMouse)
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('resize', resize)
  }
}
