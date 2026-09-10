import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'assets', 'og');
fs.mkdirSync(OUT, { recursive: true });

const BG = '#F2F1EE', INK = '#0D0D0D', ORANGE = '#F54900', MUTED = '#6B6B66', LINE = '#DBD9D3';

const CARDS = [
  { slug: 'home', kind: 'home', img: 'david.cervantes.jpg',
    title: 'AI Product Leader,<br>Designer, and Strategist',
    desc: '25 years shipping digital products. Now designing conversational &amp; Reactive AI — from first question to working code.' },
  { slug: 'tradervault', eyebrow: 'CASE STUDY', title: 'TraderVault LM', img: 'TraderVault_thumb.jpg',
    desc: 'Conversational AI trading intelligence, built the way traders actually think.' },
  { slug: 'tintoprops', eyebrow: 'CASE STUDY', title: 'TintoProps', img: 'TintoProps_thumb.jpg',
    desc: "Colombia's first AI-native real estate portal." },
  { slug: 'construct', eyebrow: 'CASE STUDY', title: 'Construct AI', img: 'ConstructAI_thumb.jpg',
    desc: 'Project intelligence for construction teams — proactive and voice-first.' },
  { slug: 'ultra', eyebrow: 'CASE STUDY', title: 'ULTRA', img: 'ultra.webp',
    desc: 'A social feed you control — sentiment filters and blockchain transparency.' },
  { slug: 'nestre', eyebrow: 'CASE STUDY', title: 'NESTRE', img: 'nestre.webp',
    desc: 'A cognitive-training facility, rebuilt for mobile.' },
  { slug: 'ulta', eyebrow: 'CASE STUDY', title: 'Ulta Beauty Media', img: 'ubmedia.webp',
    desc: 'A self-serve retail-media ad platform on first-party data.' },
  { slug: 'yelo', eyebrow: 'CASE STUDY', title: 'Yelo', img: 'yelo.webp',
    desc: 'A ride-hailing network built only for campus.' },
  { slug: 'aigenius', eyebrow: 'CASE STUDY', title: 'AI Genius', img: 'giggenius.webp',
    desc: 'Freelance intelligence platform — AI for project-based work.' },
  { slug: 'intent-centered-design', kind: 'article', eyebrow: 'METHOD', title: 'Intent-Centered<br>Design',
    desc: 'Designing AI products around what the user is trying to do — not the model, not a chat box.' },
  { slug: 'reactive-ai', kind: 'article', eyebrow: 'METHOD', title: 'Reactive AI',
    desc: 'AI that responds to what’s happening — surfacing the right thing at the right moment, instead of waiting to be asked.' },
  { slug: 'conversational-flow-mapping', kind: 'article', eyebrow: 'METHOD', title: 'Conversational<br>Flow Mapping',
    desc: 'Designing an AI conversation like a product flow — intents, turns, and hand-offs, before the prompt.' },
];

const wordmark = (light) => `
  <div style="display:flex;align-items:center;gap:14px">
    <div style="width:52px;height:52px;border-radius:14px;background:${light ? '#fff' : INK};border:0.5px solid ${light ? LINE : 'transparent'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:24px;color:${light ? INK : BG}">d<span style="color:${ORANGE}">c</span></div>
    <span style="font-weight:600;font-size:26px;color:${INK}">david<span style="color:${ORANGE}">.</span>cervantes</span>
  </div>`;

function cardHome(c) {
  return `
  <section id="card-${c.slug}" class="card">
    <div style="position:absolute;inset:0 42% 0 0;padding:76px 0 64px 80px;display:flex;flex-direction:column;justify-content:space-between;z-index:2">
      ${wordmark(true)}
      <div>
        <h1 style="margin:0 0 22px;font-weight:700;font-size:76px;line-height:1.02;letter-spacing:-0.025em;color:${INK}">${c.title}</h1>
        <p style="margin:0;font-weight:400;font-size:26px;line-height:1.42;color:${MUTED};max-width:560px">${c.desc}</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;font-weight:500;font-size:22px;color:${INK}">
        <span style="width:10px;height:10px;border-radius:50%;background:${ORANGE};display:inline-block"></span>uxokdc.com
      </div>
    </div>
    <div style="position:absolute;inset:0 0 0 56%;overflow:hidden">
      <img src="assets/${c.img}" style="width:100%;height:100%;object-fit:cover;object-position:right top"/>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,${BG} 0%,rgba(242,241,238,0.55) 14%,rgba(242,241,238,0) 42%)"></div>
    </div>
  </section>`;
}

function cardCase(c) {
  return `
  <section id="card-${c.slug}" class="card">
    <div style="position:absolute;inset:0 46% 0 0;padding:72px 0 64px 80px;display:flex;flex-direction:column;justify-content:space-between;z-index:2">
      ${wordmark(true)}
      <div>
        <div style="font-weight:600;font-size:19px;letter-spacing:0.18em;color:${ORANGE};margin-bottom:20px">${c.eyebrow}</div>
        <h1 style="margin:0 0 22px;font-weight:700;font-size:68px;line-height:1.02;letter-spacing:-0.025em;color:${INK}">${c.title}</h1>
        <p style="margin:0;font-weight:400;font-size:25px;line-height:1.42;color:${MUTED};max-width:500px">${c.desc}</p>
      </div>
      <div style="font-weight:500;font-size:20px;color:${MUTED}">Case study · David Cervantes</div>
    </div>
    <div style="position:absolute;top:64px;bottom:64px;right:64px;left:56%;border-radius:20px;overflow:hidden;box-shadow:0 30px 60px rgba(13,13,13,0.20);border:0.5px solid ${LINE}">
      <img src="assets/${c.img}" style="width:100%;height:100%;object-fit:cover;object-position:center top"/>
    </div>
  </section>`;
}

function cardArticle(c) {
  return `
  <section id="card-${c.slug}" class="card">
    <div style="position:absolute;inset:0;padding:76px 80px 64px;display:flex;flex-direction:column;justify-content:space-between;z-index:2">
      ${wordmark(true)}
      <div style="max-width:900px">
        <div style="font-weight:600;font-size:19px;letter-spacing:0.18em;color:${ORANGE};margin-bottom:22px">${c.eyebrow}</div>
        <h1 style="margin:0 0 26px;font-weight:700;font-size:88px;line-height:0.98;letter-spacing:-0.03em;color:${INK}">${c.title}</h1>
        <p style="margin:0;font-weight:400;font-size:28px;line-height:1.4;color:${MUTED};max-width:820px">${c.desc}</p>
      </div>
      <div style="font-weight:500;font-size:20px;color:${MUTED}">Essay · David Cervantes · uxokdc.com</div>
    </div>
    <div style="position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;border:64px solid ${ORANGE};opacity:0.10"></div>
  </section>`;
}

const cardsHtml = CARDS.map(c => c.kind === 'home' ? cardHome(c) : c.kind === 'article' ? cardArticle(c) : cardCase(c)).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{font-family:'Google Sans','Outfit',system-ui,sans-serif;background:#888}
  .card{position:relative;width:1200px;height:630px;background:${BG};overflow:hidden;margin:0 0 24px}
</style></head><body>${cardsHtml}</body></html>`;

const tmp = path.join(ROOT, '._og_preview.html');
fs.writeFileSync(tmp, html);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto('file://' + tmp);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

for (const c of CARDS) {
  const el = await page.$('#card-' + c.slug);
  const file = path.join(OUT, (c.slug === 'home' ? 'home' : c.slug) + '.png');
  await el.screenshot({ path: file });
  console.log('wrote', path.relative(ROOT, file));
}
await browser.close();
fs.unlinkSync(tmp);
console.log('done');
