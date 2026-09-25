document.addEventListener('DOMContentLoaded', () => {
  const el = document.createElement('pre');
  el.id = 'nyan-bg';
  document.body.prepend(el);

  const FS = 14;
  const rainbow = ['#ff0000', '#ff9900', '#ffff00', '#33ff00', '#0099ff', '#6633ff'];
  const GRAY = '#999999';
  let W, H, CW, stars = [], t = 0;

  function setup() {
    el.textContent = 'M'.repeat(100);
    const probe = document.createRange();
    probe.selectNodeContents(el);
    CW = probe.getBoundingClientRect().width / 100 || 8.4;
    W = Math.ceil(innerWidth / CW) + 1;
    H = Math.ceil(innerHeight / FS) + 1;
    stars = [];
    const n = Math.floor(W * H / 60);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W | 0,
        y: Math.random() * H | 0,
        p: Math.random() * 4 | 0,
        speed: 1 + (Math.random() * 2 | 0)
      });
    }
  }

  function draw() {
    const ch = [], co = [];
    for (let y = 0; y < H; y++) {
      ch.push(Array(W).fill(' '));
      co.push(Array(W).fill(null));
    }
    const put = (x, y, c, col) => {
      if (x >= 0 && x < W && y >= 0 && y < H) { ch[y][x] = c; co[y][x] = col; }
    };
    const rect = (x, y, w, h, c, col) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, c, col);
    };

    // Stars
    stars.forEach(s => {
      const x = (((s.x - t * s.speed) % W) + W) % W;
      put(x, s.y, ['.', '+', '*', '+'][(s.p + (t >> 2)) & 3], '#ffffff');
    });

    const phase = (t >> 2) & 1;
    const cx = Math.max(4, Math.floor(W / 2 - 13));
    const cy = Math.max(1, Math.floor(H / 2 - 6)) + phase;

    // Rainbow trail
    for (let x = 0; x < cx + 4; x++) {
      const off = ((x + t) >> 2) & 1;
      rainbow.forEach((c, i) => put(x, cy + 1 + i + off, '#', c));
    }

    // Tail
    rect(cx - 4, cy + 3 + phase, 4, 2, '%', GRAY);

    // Body
    rect(cx, cy, 18, 9, '#', '#e8c890');
    rect(cx + 1, cy + 1, 16, 7, '@', '#ff99ff');
    [[3,1],[9,1],[13,2],[6,3],[11,4],[2,5],[8,6],[14,6],[4,3]].forEach(([dx, dy]) =>
      put(cx + 1 + dx, cy + 1 + dy, '+', '#ff3399'));

    // Legs
    [2, 6, 12, 16].forEach((lx, i) => {
      rect(cx + lx + ((i + phase) & 1), cy + 9, 2, 2, '%', GRAY);
    });

    // Head
    const hx = cx + 15, hy = cy + 2;
    rect(hx, hy, 12, 7, '%', GRAY);
    rect(hx + 1, hy - 1, 2, 1, 'A', GRAY);
    rect(hx + 9, hy - 1, 2, 1, 'A', GRAY);
    put(hx + 3, hy + 2, 'o', '#000000');
    put(hx + 8, hy + 2, 'o', '#000000');
    put(hx + 1, hy + 4, '@', '#ff9999');
    put(hx + 10, hy + 4, '@', '#ff9999');
    put(hx + 4, hy + 4, 'w', '#000000');
    put(hx + 7, hy + 4, 'w', '#000000');

    // Render
    let html = '';
    for (let y = 0; y < H; y++) {
      let x = 0;
      while (x < W) {
        const c = co[y][x];
        let s = '';
        while (x < W && co[y][x] === c) s += ch[y][x++];
        html += c ? `<span style="color:${c}">${s}</span>` : s;
      }
      html += '\n';
    }
    el.innerHTML = html;
    t++;
  }

  setup();
  draw();
  setInterval(draw, 90);
  addEventListener('resize', setup);
});
