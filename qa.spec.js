/**
 * qa.spec.js — uxokdc.com scoped QA checker
 *
 * Usage:
 *   node qa.spec.js                     # run all checks (initial audit)
 *   node qa.spec.js --scope hero        # only hero checks
 *   node qa.spec.js --scope nav         # only nav checks
 *   node qa.spec.js --scope links       # only thumbnail link checks
 *   node qa.spec.js --scope spacing     # only layout/spacing checks
 *   node qa.spec.js --scope animations  # only animation checks
 *   node qa.spec.js --scope stop        # lightweight stop-hook check (last 3 scopes touched)
 *
 * The Stop hook calls --scope stop, which checks only what changed this session.
 * For a full audit, run with no args.
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// Parse scope from args
const args = process.argv.slice(2);
const scopeIdx = args.indexOf('--scope');
const SCOPE = scopeIdx >= 0 ? args[scopeIdx + 1] : 'all';

// ── Parse source files ────────────────────────────────────────────────────────
const indexHTML  = read('index.html');
const supportJS  = read('support.js');
const dom        = new JSDOM(indexHTML);
const doc        = dom.window.document;
const cssMatch   = supportJS.match(/const DS_CSS = `([\s\S]*?)`;/);
const DS_CSS     = cssMatch ? cssMatch[1] : '';
const helmetStyle = (indexHTML.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
const scriptEl   = doc.querySelector('script[type="text/x-dc"]');
const componentSrc = scriptEl ? scriptEl.textContent : '';

// ── Result tracking ───────────────────────────────────────────────────────────
const results = [];
const check = (label, pass, detail) => {
  results.push({ label, pass, detail });
  const d = detail ? '  → ' + detail : '';
  console.log('  ' + (pass ? '✅' : '❌ FAIL:') + ' ' + label + d);
  return pass;
};

// ── Check suites (each returns void, registers checks) ───────────────────────

function checkHero() {
  console.log('\n📱 Hero');
  const hero = doc.getElementById('top');
  check('Hero section #top exists', !!hero);
  const heroImg = doc.querySelector('.dc-hero-img');
  check('Hero image src = david.cervantes.jpg',
    !!heroImg && heroImg.getAttribute('src') === 'assets/david.cervantes.jpg');
  check('Hero image object-position: right top (desktop)',
    helmetStyle.includes('object-position:right top'));
  check('Hero image object-position: center top (mobile)',
    helmetStyle.includes('object-position:center top'));
  check('Hero text overlay at top:130px',
    !!doc.querySelector('#top [style*="top:130px"]'));
  check('Mobile small lines explicit 26px',
    componentSrc.includes("mob ? '26px'"));
  check('Mobile big quote explicit 42px',
    componentSrc.includes("mob ? '42px'"));
  check('Mobile hero gap reduced to 18px',
    helmetStyle.includes('gap:18px'));
}

function checkNav() {
  console.log('\n🔗 Nav');
  const wordmark = doc.getElementById('dc-logo');
  check('dc-logo wordmark in nav',
    !!wordmark && wordmark.textContent.includes('cervantes'),
    wordmark ? wordmark.textContent.trim() : 'missing');
  check('dc logo box in nav', !!doc.querySelector('nav a div'));
  check('Mobile nav has About link',    supportJS.includes("pill('/About'"));
  check('Mobile nav has Experience link', supportJS.includes("pill('/Experience'"));
  check('Mobile nav has Work link',     supportJS.includes("pill('/Work'"));
  check('Mobile nav bg 80% opacity',
    DS_CSS.includes('rgba(242,241,238,0.8)'));
}

function checkLinks() {
  console.log('\n🔗 Thumbnail links');
  const cat1 = Array.from(doc.querySelectorAll('#cat1-row a[href]'));
  check('AI row >= 3 linked thumbs', cat1.length >= 3, cat1.length + ' found');
  check('All AI thumbs → case studies',
    cat1.length > 0 && cat1.every(a => (a.getAttribute('href') || '').toLowerCase().includes('case')),
    cat1.map(a => a.getAttribute('href')).join(' | '));
  const cat2 = Array.from(doc.querySelectorAll('#cat2-row a[href]'));
  check('Tech row >= 3 linked thumbs', cat2.length >= 3, cat2.length + ' found');
  check('All Tech thumbs → case studies',
    cat2.length > 0 && cat2.every(a => (a.getAttribute('href') || '').toLowerCase().includes('case')),
    cat2.map(a => a.getAttribute('href')).join(' | '));
}

function checkSpacing() {
  console.log('\n📐 Spacing');
  const stmt = doc.querySelector('[data-screen-label="Statement"]');
  check('Statement padding = 78px',
    !!stmt && (stmt.getAttribute('style') || '').includes('78px'));
  check('Statement min-height = 52vh',
    !!stmt && (stmt.getAttribute('style') || '').includes('52vh'));
  check('Cat-row first card has 20px left margin',
    (doc.querySelector('#cat1-row a[style*="margin:0 0 0 20px"]') !== null));
}

function checkAnimations() {
  console.log('\n🎬 Animations');
  check('@keyframes rise in helmet',   helmetStyle.includes('@keyframes rise'));
  check('@keyframes pageEnter in DS_CSS', DS_CSS.includes('@keyframes pageEnter'));
  check('x-dc.dc-ready entry animation wired', DS_CSS.includes('pageEnter'));
  check('.cat-title scroll animation',  helmetStyle.includes('.cat-title'));
  check('.cat-row scroll animation',    helmetStyle.includes('.cat-row'));
  check('Thumbnail hover lift CSS',     helmetStyle.includes(':hover'));
}

function checkFiles() {
  console.log('\n📄 Case study files');
  [
    'TraderVault LM Case Study.html',
    'TintoProps Case Study.html',
    'Construct AI Case Study.html',
    'NESTRE Case Study.html',
    'ULTA BEAUTY Case Study.html',
    'ULTRA Case Study.html',
    'YELO Case Study.html',
  ].forEach(f => check(f, fs.existsSync(path.join(ROOT, f))));
}

// ── Scope dispatch ────────────────────────────────────────────────────────────
console.log('\n══ uxokdc QA' + (SCOPE !== 'all' ? ' [' + SCOPE + ']' : '') + ' ══\n');

switch (SCOPE) {
  case 'hero':       checkHero();       break;
  case 'nav':        checkNav();        break;
  case 'links':      checkLinks();      break;
  case 'spacing':    checkSpacing();    break;
  case 'animations': checkAnimations(); break;
  case 'files':      checkFiles();      break;
  // stop hook: fast check of the most change-prone areas
  case 'stop':
    checkHero();
    checkNav();
    checkLinks();
    checkSpacing();
    break;
  // full audit (no --scope or --scope all)
  default:
    checkHero();
    checkNav();
    checkLinks();
    checkSpacing();
    checkAnimations();
    checkFiles();
}

// ── Summary ───────────────────────────────────────────────────────────────────
const passed = results.filter(r => r.pass).length;
const total  = results.length;
console.log('\n' + '═'.repeat(44));
console.log('QA [' + SCOPE + ']: ' + passed + '/' + total + (passed === total ? ' 🎉' : ' — see failures above'));

if (passed < total) {
  console.log('\nFailed:');
  results.filter(r => !r.pass).forEach(r =>
    console.log('  ✗ ' + r.label + (r.detail ? ' (' + r.detail + ')' : '')));
}

// Exit non-zero so the Stop hook surfaces failures to Claude
process.exit(passed === total ? 0 : 1);
