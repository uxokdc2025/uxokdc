import fs from 'node:fs';

const HOST = 'https://www.uxokdc.com';
const OGDIR = HOST + '/assets/og/';
const AUTHOR = 'David Cervantes';
const HANDLE = '@uxokdc';

// slug = URL path after host (clean, url-encoded); og = card filename; type = og:type
const PAGES = {
  'index.html': {
    slug: '/', og: 'home.png', type: 'website',
    title: 'David Cervantes — AI Product Designer & Strategist',
    desc: '25 years designing digital products — from interfaces to AI-native systems. Product strategy, UX research, design systems, and working code.',
    ld: 'person',
  },
  'About.html': {
    slug: '/About', og: 'home.png', type: 'profile',
    title: 'About — David Cervantes · AI Product Designer & Strategist',
    desc: 'Product designer and strategist with 25 years turning complex products into things people actually want to use. Now designing and building AI-native. Available for select engagements.',
    ld: 'skip', // keeps its richer hand-written Person JSON-LD
  },
  'Experience.html': {
    slug: '/Experience', og: 'home.png', type: 'website',
    title: 'Experience — David Cervantes',
    desc: 'Career timeline: design leadership across AI, SaaS, e-commerce, fintech, healthcare, and enterprise — from IC to strategy over 25 years.',
    ld: 'person',
  },
  'Work.html': {
    slug: '/Work', og: 'home.png', type: 'website',
    title: 'Work — David Cervantes',
    desc: 'Selected case studies: AI products, SaaS platforms, native apps, and brand systems built across 25 years of product design.',
    ld: 'collection',
  },
  'Portfolio Explorations.html': {
    slug: '/Portfolio%20Explorations', og: 'home.png', type: 'website',
    title: 'Portfolio Explorations — David Cervantes',
    desc: 'Visual explorations, interface studies, and design experiments by David Cervantes — AI product designer & strategist.',
    ld: 'collection',
  },
  'TraderVault LM Case Study.html': {
    slug: '/TraderVault%20LM%20Case%20Study', og: 'tradervault.png', type: 'article',
    title: 'TraderVault LM — AI Trading Intelligence | David Cervantes',
    desc: 'Case study: designing a conversational AI trading platform built the way traders actually think. Strategy, research, and end-to-end product design.',
    ld: 'case',
  },
  'TintoProps Case Study.html': {
    slug: '/TintoProps%20Case%20Study', og: 'tintoprops.png', type: 'article',
    title: 'TintoProps — AI-Native Real Estate Portal | David Cervantes',
    desc: "Case study: Colombia's first AI-native real estate portal. End-to-end product design for property search powered by conversational AI.",
    ld: 'case',
  },
  'Construct AI Case Study.html': {
    slug: '/Construct%20AI%20Case%20Study', og: 'construct.png', type: 'article',
    title: 'Construct AI — Project Intelligence Platform | David Cervantes',
    desc: 'Case study: AI project intelligence for construction teams. Designing proactive insights and voice-first workflows for field and office.',
    ld: 'case',
  },
  'ULTRA Case Study.html': {
    slug: '/ULTRA%20Case%20Study', og: 'ultra.png', type: 'article',
    title: 'ULTRA — Social Feed You Control | David Cervantes',
    desc: 'Case study: a social feed built on sentiment filters and blockchain transparency. Designing trust and control back into social media.',
    ld: 'case',
  },
  'NESTRE Case Study.html': {
    slug: '/NESTRE%20Case%20Study', og: 'nestre.png', type: 'article',
    title: 'NESTRE — Cognitive Training App | David Cervantes',
    desc: 'Case study: rebuilding a cognitive training facility for mobile. 90% smooth navigation, 85% professional feel in usability testing.',
    ld: 'case',
  },
  'ULTA BEAUTY Case Study.html': {
    slug: '/ULTA%20BEAUTY%20Case%20Study', og: 'ulta.png', type: 'article',
    title: 'Ulta Beauty Media — Self-Serve Ad Platform | David Cervantes',
    desc: 'Case study: a self-serve advertising platform built on first-party retail data. 85% usability score, designed for non-technical media buyers.',
    ld: 'case',
  },
  'YELO Case Study.html': {
    slug: '/YELO%20Case%20Study', og: 'yelo.png', type: 'article',
    title: 'Yelo — Campus Ride-Hailing Network | David Cervantes',
    desc: 'Case study: a ride-hailing network built only for campus. 90% safety satisfaction, 25% reduction in wait times.',
    ld: 'case',
  },
  'AI Genius Case Study.html': {
    slug: '/AI%20Genius%20Case%20Study', og: 'aigenius.png', type: 'article',
    title: 'AI Genius — Freelance Intelligence Platform | David Cervantes',
    desc: 'Case study: revolutionizing project-based work with AI. 90% of freelancer personas saved time; 85% of companies noted less hiring complexity.',
    ld: 'case',
  },
};

const KW = {
  'tradervault.png': 'AI product design, conversational AI, Reactive AI, Intent-Centered Design, fintech, trading, decision support, explainability',
  'tintoprops.png': 'AI product design, real estate, proptech, conversational AI, UX case study, Colombia',
  'construct.png': 'AI product design, construction tech, project intelligence, voice-first, UX case study',
  'ultra.png': 'social media design, blockchain, feed algorithms, sentiment, UX case study',
  'nestre.png': 'mobile app design, cognitive training, health tech, usability, UX case study',
  'ulta.png': 'retail media, ad platform, first-party data, self-serve, UX case study',
  'yelo.png': 'mobility design, ride-hailing, campus app, safety, UX case study',
  'aigenius.png': 'AI product design, freelance platform, gig economy, project intelligence, UX case study',
};
for (const p of Object.values(PAGES)) if (p.ld === 'case') p.keywords = KW[p.og];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function jsonld(p) {
  if (p.ld === 'skip') return null;
  const url = HOST + p.slug;
  if (p.ld === 'person') {
    return {
      '@context': 'https://schema.org', '@type': 'Person', name: AUTHOR, url: HOST,
      image: OGDIR + 'home.png', jobTitle: 'AI Product Designer & Strategist',
      description: p.desc, email: 'uxokdc@gmail.com',
      sameAs: ['https://www.linkedin.com/in/davidcervantes/', HOST],
      knowsAbout: ['UX Design', 'Product Strategy', 'AI Product Design', 'Design Systems', 'User Research', 'Interaction Design', 'Conversational AI', 'Reactive AI'],
    };
  }
  if (p.ld === 'collection') {
    return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: p.title, url, description: p.desc, author: { '@type': 'Person', name: AUTHOR, url: HOST } };
  }
  // case
  return {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, headline: p.title,
    url, image: OGDIR + p.og, description: p.desc, genre: 'UX Case Study', inLanguage: 'en',
    keywords: p.keywords || 'AI product design, UX case study, product strategy, design systems',
    author: { '@type': 'Person', name: AUTHOR, url: HOST, sameAs: ['https://www.linkedin.com/in/davidcervantes/', HOST] },
    creator: { '@type': 'Person', name: AUTHOR, url: HOST },
    publisher: { '@type': 'Person', name: AUTHOR, url: HOST },
    isPartOf: { '@type': 'WebSite', name: 'David Cervantes Portfolio', url: HOST },
  };
}

function block(file, p) {
  const url = HOST + p.slug;
  const img = OGDIR + p.og;
  const lines = [
    '<!-- SEO:start (generated — do not hand-edit; run ._seo_inject.mjs) -->',
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.desc)}">`,
    `<meta name="author" content="${AUTHOR}">`,
    `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
    `<meta name="theme-color" content="#F2F1EE">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="icon" type="image/svg+xml" href="/favicon-dc.svg">`,
    `<meta property="og:type" content="${p.type}">`,
    `<meta property="og:site_name" content="${AUTHOR}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(p.desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:secure_url" content="${img}">`,
    `<meta property="og:image:type" content="image/png">`,
    `<meta property="og:image:width" content="2400">`,
    `<meta property="og:image:height" content="1260">`,
    `<meta property="og:image:alt" content="${esc(p.title)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="${HANDLE}">`,
    `<meta name="twitter:creator" content="${HANDLE}">`,
    `<meta name="twitter:title" content="${esc(p.title)}">`,
    `<meta name="twitter:description" content="${esc(p.desc)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${esc(p.title)}">`,
  ];
  const ld = jsonld(p);
  if (ld) lines.push(`<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
  lines.push('<!-- SEO:end -->');
  return lines.join('\n');
}

// Managed single-line tags we strip before re-inserting (keeps hand-written JSON-LD)
const STRIP = [
  /^\s*<title>[\s\S]*?<\/title>\s*$/i,
  /^\s*<meta\s+name="(description|author|robots|theme-color|keywords|twitter:[^"]+)"[^>]*>\s*$/i,
  /^\s*<meta\s+property="og:[^"]+"[^>]*>\s*$/i,
  /^\s*<link\s+rel="canonical"[^>]*>\s*$/i,
  /^\s*<link\s+rel="icon"[^>]*>\s*$/i,
];

let changed = 0;
for (const [file, p] of Object.entries(PAGES)) {
  if (!fs.existsSync(file)) { console.log('MISSING', file); continue; }
  let html = fs.readFileSync(file, 'utf8');

  // 1) remove any previous generated block
  html = html.replace(/\n?[ \t]*<!-- SEO:start[\s\S]*?<!-- SEO:end -->\n?/g, '\n');

  // 1b) for pages we generate JSON-LD for, strip all remaining (old hand-written) ld+json
  //     so each page ends with exactly one canonical block. About (ld:'skip') keeps its rich one.
  if (p.ld !== 'skip') {
    html = html.replace(/\n?[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/gi, '\n');
  }

  // 2) split head/rest, strip managed tags only within head
  const headEnd = html.indexOf('</head>');
  let head = html.slice(0, headEnd);
  const rest = html.slice(headEnd);
  head = head.split('\n').filter(l => !STRIP.some(rx => rx.test(l))).join('\n');

  // 3) insert generated block right after the viewport meta
  const vp = /(<meta\s+name="viewport"[^>]*>)/i;
  if (!vp.test(head)) { console.log('NO VIEWPORT', file); continue; }
  head = head.replace(vp, `$1\n${block(file, p)}`);

  // collapse 3+ blank lines
  const out = (head + rest).replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(file, out);
  changed++;
  console.log('injected', file);
}
console.log(`\n${changed} files updated`);
