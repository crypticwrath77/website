(function () {
  "use strict";

  // ---- canvas setup, injected behind everything ----
  const canvas = document.createElement("canvas");
  canvas.id = "nyan-bg";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-1",
    pointerEvents: "none",
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- starfield ----
  const STAR_COUNT = 80;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
  }));

  // ---- ascii nyan cat frames (2-frame leg animation) ----
  const FRAMES = [
    [
      "    _,------,",
      "    _|  /\\_/\\ ",
      "^__^/  (=^.^=)",
      " (oo)\\ /   \" \"",
      " (__)\\|    |",
      "      ||   ||",
    ],
    [
      "    _,------,",
      "    _|  /\\_/\\ ",
      "^__^/  (=^.^=)",
      " (oo)\\ /   \" \"",
      "  (__)\\|   |",
      "       ||  ||",
    ],
  ];

  const FONT_SIZE = 12;
  const LINE_HEIGHT = FONT_SIZE * 1.15;
  ctx.font = `${FONT_SIZE}px "Ioskeley Mono", monospace`;
  const CAT_WIDTH = Math.max(...FRAMES[0].map((l) => l.length)) * (FONT_SIZE * 0.6);
  const CAT_HEIGHT = FRAMES[0].length * LINE_HEIGHT;

  let x = -CAT_WIDTH;
  let y = window.innerHeight * 0.3;
  const speed = 60; // px/sec
  let frameIdx = 0;
  let lastFrameSwitch = 0;
  let lastTime = performance.now();

  const rainbow = ["#ff5f5f", "#ffb85f", "#ffe75f", "#8aff5f", "#5fb8ff", "#a55fff"];
  const trail = [];

  function drawStars(t) {
    ctx.fillStyle = "#d4d4d4";
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(t / 600 + s.phase);
      ctx.globalAlpha = 0.15 + twinkle * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawTrail() {
    const stripeH = CAT_HEIGHT / rainbow.length;
    for (const pos of trail) {
      rainbow.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = pos.life;
        ctx.fillRect(pos.x, y + i * stripeH, CAT_WIDTH * 0.5, stripeH);
      });
    }
    ctx.globalAlpha = 1;
  }

  function drawCat() {
    ctx.fillStyle = "#f5f5f5";
    ctx.font = `${FONT_SIZE}px "Ioskeley Mono", monospace`;
    FRAMES[frameIdx].forEach((line, i) => {
      ctx.fillText(line, x, y + i * LINE_HEIGHT);
    });
  }

  function frame(t) {
    const dt = (t - lastTime) / 1000;
    lastTime = t;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawStars(t);

    x += speed * dt;
    if (x > window.innerWidth + CAT_WIDTH) {
      x = -CAT_WIDTH;
      y = window.innerHeight * (0.2 + Math.random() * 0.5);
    }

    if (t - lastFrameSwitch > 200) {
      frameIdx = (frameIdx + 1) % FRAMES.length;
      lastFrameSwitch = t;
      trail.push({ x, life: 0.6 });
    }

    for (const p of trail) p.life -= dt * 0.8;
    while (trail.length && trail[0].life <= 0) trail.shift();

    drawTrail();
    drawCat();

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
