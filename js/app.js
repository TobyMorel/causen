'use strict';

/** Actualizá acá enlaces y textos de los seis juegos. */
const games = [
  { id: 'republica', title: 'REPÚBLICA', category: 'ESTRATEGIA / POLÍTICA', description: 'El poder está en tus manos. Cada decisión escribe una historia diferente.', url: 'https://republica-mundial.vercel.app/', accent: '#dbfd8d' },
  { id: 'nexo', title: 'NEXO', category: 'ESPACIO / ESTRATEGIA', description: 'Conectá mundos. Gestioná colonias, cargueros y rutas a través del universo.', url: 'https://nexo-xi-eight.vercel.app/', accent: '#82f4e1' },
  { id: 'expediente', title: 'EXPEDIENTE', category: 'EXPERIENCIA INTERACTIVA', description: 'Una nueva historia te espera detrás de cada expediente.', url: 'https://expendiente.vercel.app/', accent: '#ffbd97' },
  { id: 'barro', title: 'DESDE EL BARRO', category: 'FÚTBOL / GESTIÓN', description: 'Empezá desde abajo. Construí tu camino como entrenador, partido a partido.', url: 'https://desde-el-barro.vercel.app/', accent: '#c4fa85' },
  { id: 'logisys', title: 'LOGISYS', category: 'LOGÍSTICA / SIMULACIÓN', description: 'Ponete al mando de la operación. Cada movimiento cuenta.', url: 'https://logysys.vercel.app/', accent: '#a9c9ff' },
  { id: 'pulso', title: 'PULSO ESTELAR', category: 'SIMULACIÓN / ESPACIO', description: 'Un nuevo universo por descubrir. Explorá Pulso Estelar y viví la experiencia.', url: 'https://pulso-estelar-git-main-tobias-morel.vercel.app/', accent: '#c4b5ff' }
];

const shell = document.getElementById('siteShell');
const scenes = [...document.querySelectorAll('.slide')];
const cards = [...document.querySelectorAll('.game-card')];
const title = document.getElementById('gameTitle');
const category = document.getElementById('gameCategory');
const description = document.getElementById('gameDescription');
const number = document.getElementById('gameNumber');
const sideNumber = document.getElementById('sideNumber');
const playButton = document.getElementById('playButton');
const copy = document.querySelector('.feature-copy');
const previewToggle = document.getElementById('previewToggle');
const previewLabel = document.getElementById('previewLabel');
const autoToggle = document.getElementById('autoToggle');
const autoLabelLarge = document.getElementById('autoLabelLarge');
const autoLabelSmall = document.getElementById('autoLabelSmall');
const autoSymbol = document.getElementById('autoSymbol');
let active = 0;
let viewMode = 'live';
let touchStartX = 0;
let touchStartY = 0;

// Las imágenes se generan por un servicio externo de capturas reales.
// Si falla, siguen viéndose las ilustraciones SVG locales que ya trae el ZIP.
const captureURLs = Object.fromEntries(games.map(game => [game.id,
  `https://image.thum.io/get/noanimate/width/960/crop/675/maxAge/72/${game.url}`
]));

function setupCaptures() {
  for (const img of document.querySelectorAll('[data-capture-game]')) {
    const id = img.dataset.captureGame;
    img.addEventListener('load', () => {
      // Evita mostrar una imagen vacía en caso de una respuesta anómala.
      if (img.naturalWidth > 10 && img.naturalHeight > 10) img.classList.add('capture-ready');
    });
    img.addEventListener('error', () => img.classList.remove('capture-ready'));
    img.src = window.LOCAL_CAPTURE_URLS?.[id] || captureURLs[id];
    img.decoding = 'async';
  }
}

const reachability = new Map();
function canReach(url) {
  if (!reachability.has(url)) {
    // Una comprobación de conectividad evita poner una página de error del
    // navegador encima de la captura cuando se abre el portfolio sin Internet.
    reachability.set(url, fetch(url, {method: 'HEAD', mode: 'no-cors'})
      .then(() => true).catch(() => false));
  }
  return reachability.get(url);
}
async function loadFrame(scene) {
  if (viewMode !== 'live') return;
  const frame = scene.querySelector('iframe');
  if (!frame || frame.hasAttribute('src')) return;
  const reachable = await canReach(frame.dataset.src);
  if (!reachable || viewMode !== 'live' || !scene.classList.contains('is-active') || frame.hasAttribute('src')) return;
  frame.onload = () => {
    if (!scene.classList.contains('is-active') || viewMode !== 'live') return;
    try { if (frame.contentDocument?.URL === 'about:blank') return; } catch (_) { /* Otra web */ }
    scene.classList.add('iframe-loaded');
  };
  frame.setAttribute('src', frame.dataset.src);
}
function unloadFrame(scene) {
  const frame = scene.querySelector('iframe');
  if (!frame || !frame.hasAttribute('src')) return;
  frame.removeAttribute('src');
  scene.classList.remove('iframe-loaded');
}

function showGame(index, updateHash = true, automatic = false) {
  const next = ((index % games.length) + games.length) % games.length;
  const game = games[next];
  // Los cambios automáticos no interrumpen al lector de pantalla.
  copy.setAttribute('aria-live', automatic ? 'off' : 'polite');
  active = next;
  shell.style.setProperty('--accent', game.accent);
  scenes.forEach((scene, i) => {
    scene.classList.toggle('is-active', i === next);
    if (i === next) loadFrame(scene);
    else unloadFrame(scene);
  });
  title.textContent = game.title;
  title.classList.toggle('is-long', game.id === 'barro' || game.id === 'pulso');
  title.classList.toggle('is-medium', game.id === 'expediente');
  category.textContent = game.category;
  number.textContent = `${String(next + 1).padStart(2,'0')} / ${String(games.length).padStart(2,'0')}`;
  sideNumber.innerHTML = `${String(next + 1).padStart(2,'0')}<span>/${String(games.length).padStart(2,'0')}</span>`;
  description.textContent = game.description;
  playButton.href = game.url;
  playButton.setAttribute('aria-label', `Entrar a jugar ${game.title} (abre en una pestaña nueva)`);
  for (const [i, card] of cards.entries()) {
    const current = i === next;
    card.classList.toggle('is-current', current);
    const button = card.querySelector('.card-select');
    if (current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  }
  copy.classList.remove('is-changing');
  void copy.offsetWidth;
  copy.classList.add('is-changing');
  document.title = `${game.title} — CUASEN`;
  if (updateHash && location.hash.substring(1) !== game.id) history.replaceState(null, '', `#${game.id}`);
}

for (const button of document.querySelectorAll('.card-select')) {
  button.addEventListener('click', () => {
    showGame(Number(button.dataset.index));
    // En móvil la galería continúa abajo; al elegir un juego volvemos a la vista grande.
    if (window.matchMedia('(max-width: 760px)').matches) {
      document.querySelector('.feature').scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
}
document.getElementById('prevButton').addEventListener('click', () => showGame(active - 1));
document.getElementById('nextButton').addEventListener('click', () => showGame(active + 1));

document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); showGame(0); if (innerWidth <= 760) window.scrollTo({top:0,behavior:'smooth'}); });

previewToggle.addEventListener('click', () => {
  viewMode = viewMode === 'live' ? 'capture' : 'live';
  const live = viewMode === 'live';
  shell.classList.toggle('is-capture', !live);
  previewLabel.textContent = live ? 'VISTA EN VIVO' : 'VISTA CAPTURA';
  previewToggle.setAttribute('aria-pressed', String(live));
  previewToggle.setAttribute('aria-label', live ? 'Cambiar a vista de captura' : 'Cambiar a vista en vivo');
  if (live) loadFrame(scenes[active]);
  else scenes.forEach(unloadFrame);
});

window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
  if (event.key === 'ArrowRight') {event.preventDefault();showGame(active + 1);}
  else if (event.key === 'ArrowLeft') {event.preventDefault();showGame(active - 1);}
});

const feature = document.querySelector('.feature');
feature.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, {passive:true});
feature.addEventListener('touchend', event => {
  if (event.target.closest('button,a')) return;
  const dx = event.changedTouches[0].screenX - touchStartX;
  const dy = event.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.3) showGame(active + (dx < 0 ? 1 : -1));
}, {passive:true});

// RECORRIDO AUTOMÁTICO
// Espera 9 segundos sin interacción antes del primer cambio y luego cambia cada 7.
// Se detiene cuando la pestaña o la vista principal no están a la vista.
const IDLE_WAIT_MS = 9000;
const AUTO_STEP_MS = 7000;
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let autoEnabled = !reduceMotionQuery.matches;
let autoIsPlaying = false;
let autoTimer = null;
let featureVisible = true;
let lastMouseSample = 0;

function canAutoRotate() {
  return autoEnabled && !document.hidden && featureVisible && document.hasFocus();
}
function updateAutoControl() {
  autoToggle.classList.toggle('is-disabled', !autoEnabled);
  autoToggle.classList.toggle('is-rotating', autoIsPlaying);
  autoToggle.setAttribute('aria-pressed', String(autoEnabled));
  autoToggle.setAttribute('aria-label', autoEnabled ? 'Pausar recorrido automático' : 'Activar recorrido automático');
  autoToggle.title = autoEnabled ? 'Pausar recorrido automático' : 'Activar recorrido automático';
  autoSymbol.textContent = autoEnabled ? 'Ⅱ' : '▶';
  autoLabelLarge.textContent = autoEnabled ? 'RECORRIDO AUTOMÁTICO' : 'RECORRIDO PAUSADO';
  autoLabelSmall.textContent = autoEnabled ? 'AUTO' : 'PAUSADO';
}
function stopAutoTimer() {
  clearTimeout(autoTimer);
  autoTimer = null;
  autoIsPlaying = false;
  updateAutoControl();
}
function advanceAutomatically() {
  if (!canAutoRotate()) { stopAutoTimer(); return; }
  autoIsPlaying = true;
  updateAutoControl();
  showGame(active + 1, false, true);
  autoTimer = setTimeout(advanceAutomatically, AUTO_STEP_MS);
}
function armAutoTimer() {
  stopAutoTimer();
  if (canAutoRotate()) autoTimer = setTimeout(advanceAutomatically, IDLE_WAIT_MS);
}
// El movimiento de mouse solo se registra cuando es genuino; una animación no
// cuenta como actividad. En celulares se escucha el toque y el desplazamiento.
['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'].forEach(type => {
  window.addEventListener(type, armAutoTimer, {passive: true});
});
window.addEventListener('pointermove', event => {
  if (event.pointerType && event.pointerType !== 'mouse') return;
  const now = performance.now();
  if (now - lastMouseSample > 400) {
    lastMouseSample = now;
    armAutoTimer();
  }
}, {passive: true});

// Un usuario puede pausar el pase automático de forma explícita.
autoToggle.addEventListener('click', () => {
  autoEnabled = !autoEnabled;
  armAutoTimer();
});
document.addEventListener('visibilitychange', armAutoTimer);
window.addEventListener('focus', armAutoTimer);
window.addEventListener('blur', stopAutoTimer);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    featureVisible = entry.isIntersecting;
    armAutoTimer();
  }, {threshold: 0.12}).observe(feature);
}
reduceMotionQuery.addEventListener?.('change', event => {
  if (event.matches) autoEnabled = false;
  armAutoTimer();
});

window.addEventListener('hashchange', () => {
  const index = games.findIndex(game => game.id === location.hash.substring(1));
  if (index !== -1 && index !== active) showGame(index, false);
});
setupCaptures();
const initialIndex = games.findIndex(game => game.id === location.hash.substring(1));
showGame(initialIndex === -1 ? 0 : initialIndex, false);
armAutoTimer();
