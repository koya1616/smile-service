// ============== Mobile menu ==============
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('is-open');
  mobileNav.hidden = !open;
  hamburger.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    mobileNav.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ============== Pricing tabs ==============
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('.pricing-panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
  });
});

// ============== Simulator ==============
const simState = { household: 'single', distance: 'short', season: 'normal' };

const PRICE_TABLE = {
  single: { base: [50000, 70000], truck: '2tアルミバン' },
  couple: { base: [70000, 95000], truck: '2t〜3tアルミバン' },
  family: { base: [90000, 120000], truck: '3tアルミバン' },
};
const DISTANCE_MULT = { short: 1.0, mid: 1.15, long: 1.4 };
const SEASON_MULT = { normal: 1.0, busy: 1.3 };

function fmt(n) { return Math.round(n / 1000) * 1000 |0; }
function fmtNum(n) { return n.toLocaleString('ja-JP'); }

function updateSim() {
  const t = PRICE_TABLE[simState.household];
  const dm = DISTANCE_MULT[simState.distance];
  const sm = SEASON_MULT[simState.season];
  const min = fmt(t.base[0] * dm * sm);
  const max = fmt(t.base[1] * dm * sm);
  document.getElementById('simMin').textContent = fmtNum(min);
  document.getElementById('simMax').textContent = fmtNum(max);
  document.getElementById('simTruck').textContent = t.truck;
  document.getElementById('simSeasonLabel').textContent = simState.season === 'busy' ? '繁忙期料金（割増適用）' : '通常期料金';
}

document.querySelectorAll('.sim-options').forEach(group => {
  const key = group.dataset.group;
  group.querySelectorAll('.sim-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      group.querySelectorAll('.sim-opt').forEach(o => o.classList.toggle('is-active', o === opt));
      simState[key] = opt.dataset.value;
      updateSim();
    });
  });
});

// ============== Area search ==============
const areaSearch = document.getElementById('areaSearch');
const areaCount = document.getElementById('areaCount');
const allAreaSpans = document.querySelectorAll('.area-list span');
function applyAreaFilter() {
  const q = (areaSearch.value || '').trim();
  let visible = 0;
  allAreaSpans.forEach(s => {
    s.classList.remove('is-hit');
    s.classList.remove('is-hidden');
    if (!q) { visible++; return; }
    if (s.textContent.includes(q)) { s.classList.add('is-hit'); visible++; }
    else { s.classList.add('is-hidden'); }
  });
  areaCount.textContent = q ? `${visible}件ヒット` : '';
}
areaSearch.addEventListener('input', applyAreaFilter);

// ============== Contact form ==============
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  // basic validation
  let valid = true;
  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.required && !el.value.trim()) {
      valid = false;
      el.style.borderColor = '#E63946';
    } else {
      el.style.borderColor = '';
    }
  });
  const agree = form.querySelector('input[name=agree]');
  if (!agree.checked) valid = false;
  if (!valid) { success.hidden = true; return; }
  // demo: just show success
  form.style.display = 'none';
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
