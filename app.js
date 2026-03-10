const apps = [
  {
    name: 'MegaBunnish',
    kicker: 'Ecosystem Mapping',
    description: 'Carte visuelle des projets, filtres dynamiques et exploration interactive des protocoles.',
    url: 'https://megabunnish.com/',
    tags: ['React', 'TypeScript', 'DataViz'],
    accent: 'var(--accent-cyan)',
    image: './assets/megabunnish.webp',
    status: 'live',
  },
  {
    name: 'Yield',
    kicker: 'Opportunity Radar',
    description: 'Vue rapide des opportunites DeFi, campagnes actives et rendement potentiel par protocole.',
    url: 'http://localhost:4174',
    tags: ['JavaScript', 'DeFi', 'Analytics'],
    accent: 'var(--accent-gold)',
    image: './assets/yield.webp',
    status: 'wip',
  },
  {
    name: 'PerpMath',
    kicker: 'Derivatives Desk',
    description: 'Suivi des perps, funding rates, open interest et execution des strategies de trading.',
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
  card.setAttribute('aria-label', `Ouvrir ${app.name} (${app.url})`);

  kicker.textContent = app.kicker;
  name.textContent = app.name;
  img.src = app.image;
  img.alt = `Apercu de ${app.name}`;
  description.textContent = app.description;

  if (statusEl && app.status) {
    statusEl.textContent = app.status === 'live' ? 'Live' : 'Bientôt';
    statusEl.classList.add(`app-card__status--${app.status}`);
  }

  for (const tag of app.tags) {
    const chip = document.createElement('span');
    chip.textContent = tag;
    tagsRoot.append(chip);
  }

  grid.append(fragment);
}
