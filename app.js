const apps = [
  {
    name: 'MegaBunnish',
    kicker: 'Ecosystem Map',
    description: 'Interactive map of the MegaETH ecosystem — browse every live protocol by category and explore the full on-chain landscape at a glance.',
    url: 'https://megabunnish.com/',
    tags: ['Ecosystem', 'Map', 'Megaeth'],
    accent: 'var(--accent-cyan)',
    image: './assets/megabunnish.webp',
    status: 'live',
  },
  {
    name: 'PerpMath',
    kicker: 'Perpetuals Calculator',
    description: 'FDV calculation model and real-time airdrop checker — estimate token valuations and track your airdrop allocations across protocols.',
    url: 'https://perpmath.joestarcrypto.com/',
    tags: ['Perpetuals'],
    accent: 'var(--accent-coral)',
    image: './Perpmath.png',
    status: 'live',
  },
  {
    name: 'Yield',
    kicker: 'Yield Opportunities',
    description: 'Real-time yield radar for MegaETH — track active campaigns, APRs and farming opportunities across DeFi protocols.',
    url: 'http://localhost:4174',
    tags: ['Yield', 'Defi'],
    accent: 'var(--accent-gold)',
    image: './assets/yield.webp',
    status: 'wip',
  },
];

const grid = document.getElementById('appsGrid');
const template = document.getElementById('appCardTemplate');

if (!grid || !template) {
  throw new Error('UI bootstrap failed: missing required DOM nodes.');
}

for (const [index, app] of apps.entries()) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector('.app-card');
  const kicker = fragment.querySelector('.app-card__kicker');
  const name = fragment.querySelector('.app-card__name');
  const img = fragment.querySelector('.app-card__banner-img');
  const description = fragment.querySelector('.app-card__description');
  const tagsRoot = fragment.querySelector('.app-card__tags');
  const statusEl = fragment.querySelector('.app-card__status');

  if (!card || !kicker || !name || !img || !description || !tagsRoot) {
    continue;
  }

  if (app.status === 'live') {
    card.href = app.url;
    card.setAttribute('aria-label', `Open ${app.name}`);
  } else {
    card.removeAttribute('href');
    card.classList.add('app-card--disabled');
    card.setAttribute('aria-label', app.name);
  }
  card.style.setProperty('--accent', app.accent);
  card.style.setProperty('--stagger', `${index * 90}ms`);

  kicker.textContent = app.kicker;
  name.textContent = app.name;
  img.src = app.image;
  img.alt = `${app.name} preview`;
  description.textContent = app.description;

  if (statusEl && app.status) {
    statusEl.textContent = app.status === 'live' ? 'Live' : 'Soon';
    statusEl.classList.add(`app-card__status--${app.status}`);
  }

  for (const tag of app.tags) {
    const chip = document.createElement('span');
    chip.textContent = tag;
    tagsRoot.append(chip);
  }

  grid.append(fragment);
}

// ─── TEXT SCRAMBLE ───────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = '!<>_/[]{}=+*^?#0123456789ABCDEF';
function scramble(el) {
  const original = el.dataset.original || (el.dataset.original = el.textContent);
  let frame = 0;
  const totalFrames = 22;
  const tick = () => {
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (frame / totalFrames > i / original.length) return ch;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');
    frame++;
    if (frame <= totalFrames) requestAnimationFrame(tick);
    else el.textContent = original;
  };
  requestAnimationFrame(tick);
}

// ─── 3D TILT + HOLOGRAPHIC FOIL ──────────────────────────────────────────────
for (const card of grid.querySelectorAll('.app-card')) {
  const holoEl = card.querySelector('.app-card__holo');
  const nameEl = card.querySelector('.app-card__name');

  card.addEventListener('mouseenter', () => {
    if (nameEl) scramble(nameEl);
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 6;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.018)`;
    if (holoEl) {
      const hue = ((rotY * 6) + 180) % 360;
      const angle = rotY * 3 + 110;
      holoEl.style.backgroundImage = `repeating-linear-gradient(${angle}deg,hsla(${hue},100%,70%,0) 0%,hsla(${(hue+60)%360},100%,70%,.09) 16.6%,hsla(${(hue+120)%360},100%,70%,0) 33.3%,hsla(${(hue+180)%360},100%,70%,.09) 50%,hsla(${(hue+240)%360},100%,70%,0) 66.6%,hsla(${(hue+300)%360},100%,70%,.09) 83.3%,hsla(${(hue+360)%360},100%,70%,0) 100%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    if (holoEl) holoEl.style.backgroundImage = '';
    setTimeout(() => { card.style.transition = ''; card.style.transform = ''; }, 560);
  });
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────
const pCanvas = document.getElementById('pCanvas');
if (pCanvas) {
  const ctx = pCanvas.getContext('2d');
  let W, H, pts, mx = -9999, my = -9999;

  const initCanvas = () => {
    W = pCanvas.width = window.innerWidth;
    H = pCanvas.height = window.innerHeight;
    pts = Array.from({ length: 72 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
      r: Math.random() * 1.2 + .4,
      a: Math.random() * .22 + .06,
    }));
  };

  const drawCanvas = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.hypot(dx, dy);
      if (d < 120 && d > 0) {
        const f = (120 - d) / 120 * .48;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > 1.1) { p.vx *= 1.1 / spd; p.vy *= 1.1 / spd; }
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const ed = Math.hypot(p.x - q.x, p.y - q.y);
        if (ed < 135) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - ed / 135) * .048})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawCanvas);
  };

  window.addEventListener('resize', initCanvas);
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  initCanvas();
  drawCanvas();
}

// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing) {
  let rx = 0, ry = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursorDot.style.transform = `translate(calc(${cx}px - 50%),calc(${cy}px - 50%))`;
  });
  (function animRing() {
    rx += (cx - rx) * .11;
    ry += (cy - ry) * .11;
    cursorRing.style.transform = `translate(calc(${rx}px - 50%),calc(${ry}px - 50%))`;
    requestAnimationFrame(animRing);
  })();
  for (const el of document.querySelectorAll('a, button')) {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '54px';
      cursorRing.style.height = '54px';
      cursorRing.style.borderColor = 'rgba(0, 223, 223, 0.65)';
      cursorDot.style.background = 'var(--accent-cyan)';
      cursorDot.style.boxShadow = '0 0 10px var(--accent-cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '';
      cursorRing.style.height = '';
      cursorRing.style.borderColor = '';
      cursorDot.style.background = '';
      cursorDot.style.boxShadow = '';
    });
  }
}
