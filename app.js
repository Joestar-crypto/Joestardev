const apps = [
  {
    name: 'MegaBunnish',
    kicker: 'Ecosystem Mapping',
    description: 'Visual map of protocols with dynamic filters and interactive ecosystem exploration.',
    url: 'https://megabunnish.com/',
    tags: ['React', 'TypeScript', 'DataViz'],
    accent: 'var(--accent-cyan)',
    image: './assets/megabunnish.webp',
    status: 'live',
  },
  {
    name: 'Yield',
    kicker: 'Opportunity Radar',
    description: 'Quick overview of DeFi opportunities, active campaigns and potential yield per protocol.',
    url: 'http://localhost:4174',
    tags: ['JavaScript', 'DeFi', 'Analytics'],
    accent: 'var(--accent-gold)',
    image: './assets/yield.webp',
    status: 'wip',
  },
  {
    name: 'PerpMath',
    kicker: 'Derivatives Desk',
    description: 'Track perps, funding rates, open interest and execute derivatives trading strategies.',
    url: 'https://perpmath.joestarcrypto.com/',
    tags: ['Perpetuals', 'Trading', 'Risk'],
    accent: 'var(--accent-coral)',
    image: './assets/perp.webp',
    status: 'live',
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

  card.href = app.url;
  card.style.setProperty('--accent', app.accent);
  card.style.setProperty('--stagger', `${index * 90}ms`);
  card.setAttribute('aria-label', `Open ${app.name}`);

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

// 3D tilt + cursor spotlight
for (const card of grid.querySelectorAll('.app-card')) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 7;
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 5;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.015)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    setTimeout(() => { card.style.transition = ''; card.style.transform = ''; }, 560);
  });
}
