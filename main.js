/**
 * @type {HTMLCanvasElement | null}
 */
let canvas = null;
/**
 * @type {CanvasRenderingContext2D | null}
 */
let ctx = null;
let lastDate = null;

const play = () => {
  if (!canvas) return;
  if (!ctx) {
    ctx = canvas.getContext("2d");
  }
  // Draw the canvas
  draw();
  // Start the game loop
  requestAnimationFrame(play);
};

/**
 * Gets the center of the canvas
 * @returns {{x: number, y: number}}
 */
const center = () => {
  return { x: canvas.width / 2, y: canvas.height / 2 };
};

const relative = (x) => {
  return canvas.width / 400 * x;
}

const draw = () => {
  if (!ctx) return;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"

  const d = new Date();

  // If the seconds are the same, don't draw
  if (lastDate && lastDate.getSeconds() === d.getSeconds()) {
    return;
  }
  lastDate = d;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  const c = center();

  // Draw circle at center
  ctx.beginPath();
  ctx.arc(c.x, c.y, relative(5), 0, Math.PI * 2);
  ctx.fill();

  const r = relative(-5 + 1);

  // Draw second hand
  const sf = 12;
  const sfs = 4;
  const sl = 6;
  ctx.font = `${relative(sf)}px Arial Light`;
  const s = d.getSeconds();
  const sp = d.getSeconds() / 60;
  const sa = Math.PI * 2 * sp - Math.PI / 2;
  const sacosine = Math.cos(sa);
  const sasine = Math.sin(sa);
  for (let start = { x: c.x + sacosine * r, y: c.y + sasine * r }, i = 0; i < sl; i++) {
    start.x += sacosine * relative(sf + sfs);
    start.y += sasine * relative(sf + sfs);
    ctx.fillText(s, start.x, start.y);
  }

  // Draw minute hand
  const mf = 15;
  const mfs = 4;
  const ml = 7;
  ctx.font = `${relative(mf)}px Arial`;
  const m = d.getMinutes();
  const mp = m / 60;
  const ma = Math.PI * 2 * mp - Math.PI / 2;
  const macosine = Math.cos(ma);
  const masine = Math.sin(ma);
  for (let s = { x: c.x + macosine * r, y: c.y + masine * r }, i = 0; i < ml; i++) {
    s.x += macosine * relative(mf + mfs);
    s.y += masine * relative(mf + mfs);
    ctx.fillText(m, s.x, s.y);
  }

  // Draw hour hand
  const hf = 18;
  const hfs = 5;
  const hl = 7;
  ctx.font = `${relative(hf)}px Arial Black`;
  const h = d.getHours();
  const hp = (h % 12) / 12;
  const ha = Math.PI * 2 * hp - Math.PI / 2;
  const hacosine = Math.cos(ha);
  const hasine = Math.sin(ha);
  for (let s = { x: c.x + hacosine * r, y: c.y + hasine * r }, i = 0; i < hl; i++) {
    s.x += hacosine * relative(hf + hfs);
    s.y += hasine * relative(hf + hfs);
    ctx.fillText(h, s.x, s.y);
  }
};

// Invoked when the DOM is fully loaded
const onLoad = () => {
  canvas = document.querySelector("canvas");
  onResize();
  play();
};

const onResize = () => {
  if (!canvas) return;
  const { innerWidth, innerHeight } = window;
  const size = Math.min(innerWidth, innerHeight);
  canvas.width = size * 0.9;
  canvas.height  = size * 0.9;
  lastDate = null; // Force redraw
}

// Assign the listeners
window.addEventListener("DOMContentLoaded", onLoad);
window.addEventListener("resize", onResize);