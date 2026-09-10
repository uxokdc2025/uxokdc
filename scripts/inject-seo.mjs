import fs from 'node:fs';

const HOST = 'https://www.uxokdc.com';
const OGDIR = HOST + '/assets/og/';
const AUTHOR = 'David Cervantes';
const HANDLE = '@uxokdc';

// slug = URL path after host (clean, url-encoded); og = card filename; type = og:type
const PAGES = {
  'index.html': {
    slug: '/', og: 'home.png', type: 'website',
    title: 'David Cervantes — AI Product Leader, Designer, and Strategist',
    desc: '25 years designing digital products — from interfaces to AI-native systems. Product strategy, UX research, design systems, and working code.',
    ld: 'person',
  },
  'About.html': {
    slug: '/About', og: 'home.png', type: 'profile',
    title: 'About — David Cervantes · AI Product Leader, Designer, and Strategist',
    desc: 'AI product leader, designer, and strategist with 25 years turning complex products into things people actually want to use. Now designing and building AI-native. Available for select engagements.',
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
    desc: 'Visual explorations, interface studies, and design experiments by David Cervantes — AI product leader, designer, and strategist.',
    ld: 'collection',
  },
  'Writing.html': {
    slug: '/Writing', og: 'home.png', type: 'website', noindex: true,
    title: 'Writing — David Cervantes',
    desc: 'Essays on the methods David Cervantes designs AI products around: Intent-Centered Design, Reactive AI, and Conversational Flow Mapping.',
    ld: 'collection',
  },
  'Intent-Centered-Design.html': {
    slug: '/Intent-Centered-Design', og: 'intent-centered-design.png', type: 'article', noindex: true,
    title: 'Intent-Centered Design — David Cervantes',
    desc: 'Intent-Centered Design: a method for designing AI products around what the user is trying to do — not around the model or a chat box. By David Cervantes.',
    ld: 'article',
    keywords: 'Intent-Centered Design, AI product design, conversational AI, Reactive AI, UX method, David Cervantes',
    term: ['Intent-Centered Design', "A method of designing AI products around the user's intent rather than the model's capabilities or a generic conversation — surfacing the right capability at the moment the user forms a goal, and building trust and human hand-off into the design."],
  },
  'Reactive-AI.html': {
    slug: '/Reactive-AI', og: 'reactive-ai.png', type: 'article', noindex: true,
    title: 'Reactive AI — David Cervantes',
    desc: 'Reactive AI: AI that responds to the state of the work — surfacing the right insight at the moment it matters, instead of waiting to be asked. By David Cervantes.',
    ld: 'article',
    keywords: 'Reactive AI, AI product design, ambient AI, decision support, conversational AI, David Cervantes',
    term: ['Reactive AI', "AI that responds to the state of the work — surfacing an insight, warning, or option the instant it becomes relevant, without the user having to ask, while staying explainable and correctable."],
  },
  'Conversational-Flow-Mapping.html': {
    slug: '/Conversational-Flow-Mapping', og: 'conversational-flow-mapping.png', type: 'article', noindex: true,
    title: 'Conversational Flow Mapping — David Cervantes',
    desc: 'Conversational Flow Mapping: designing an AI conversation like a product flow — mapping intents, turns, and hand-offs before writing a prompt. By David Cervantes.',
    ld: 'article',
    keywords: 'Conversational Flow Mapping, conversation design, AI UX, chatbot design, intent mapping, David Cervantes',
    term: ['Conversational Flow Mapping', "Designing an AI conversation the way you design a product flow — mapping the user's intents, the turns a conversation can take, the recovery points, and where it hands to a human, before writing the prompt."],
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

// Verified, live profiles only (probed 200/redirect). Never list a profile that 404s.
const SAMEAS = [
  'https://www.linkedin.com/in/davidcervantes/',
  'https://github.com/uxokdc2025',
  'https://davidcervantes.framer.ai/',
];
const KNOWS = ['UX Design', 'Product Strategy', 'AI Product Design', 'Conversational AI', 'Reactive AI', 'Intent-Centered Design', 'Design Systems', 'User Research', 'Interaction Design', 'Design Leadership', 'Product Management', 'Frontend Development'];
const PERSON_ID = HOST + '/#david';
const JOBTITLE = 'AI Product Leader, Designer, and Strategist';

function personEntity(desc) {
  return {
    '@type': 'Person', '@id': PERSON_ID, name: AUTHOR, url: HOST,
    image: OGDIR + 'home.png', jobTitle: JOBTITLE, description: desc, email: 'uxokdc@gmail.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Orlando', addressRegion: 'FL', addressCountry: 'US' },
    sameAs: SAMEAS, knowsAbout: KNOWS,
  };
}

// AI answer-engine bait: plain, factual Q&A that ChatGPT/Perplexity/Google can lift verbatim.
const FAQ = [
  ['Who is David Cervantes?', 'David Cervantes is an AI product leader, designer, and strategist with 25 years of experience designing and shipping digital products across fintech, healthcare, retail media, real estate, and construction. He designs conversational and Reactive AI systems end-to-end — from strategy and research through working code.'],
  ['What does David Cervantes do?', 'He leads and designs AI-native products: product strategy, UX research, design systems, and design-to-code delivery. His recent work centers on conversational AI, Reactive AI, and Intent-Centered Design.'],
  ['What is Intent-Centered Design?', 'Intent-Centered Design is David Cervantes’ approach to designing AI products around what the user is actually trying to accomplish — surfacing the right capability at the moment of intent instead of burying it in menus or chat.'],
  ['Is David Cervantes available for work?', 'Yes. David takes select contract engagements in AI product design, strategy, and design leadership. Contact him at uxokdc@gmail.com.'],
];
function faqPage() {
  return { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
}

function jsonld(p) {
  if (p.ld === 'skip') return null;
  const url = HOST + p.slug;
  if (p.ld === 'person' && p.slug === '/') {
    // Homepage: full entity graph — WebSite + ProfilePage + Person + FAQ, cross-linked by @id.
    return { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', '@id': HOST + '/#website', url: HOST, name: 'David Cervantes', description: p.desc, publisher: { '@id': PERSON_ID }, inLanguage: 'en' },
      { '@type': 'ProfilePage', '@id': url + '#profile', url, name: p.title, isPartOf: { '@id': HOST + '/#website' }, about: { '@id': PERSON_ID }, mainEntity: { '@id': PERSON_ID } },
      personEntity(p.desc),
      faqPage(),
    ] };
  }
  if (p.ld === 'person') {
    return { '@context': 'https://schema.org', ...personEntity(p.desc) };
  }
  if (p.ld === 'collection') {
    return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: p.title, url, description: p.desc, about: { '@id': PERSON_ID }, mainEntity: { '@id': PERSON_ID }, isPartOf: { '@id': HOST + '/#website' } };
  }
  if (p.ld === 'article') {
    // Article + DefinedTerm: lets Google/AI cite David as the source that defines the term.
    const graph = [
      { '@type': 'Article', '@id': url + '#article', headline: p.title, name: p.title, url, description: p.desc, image: OGDIR + p.og, datePublished: '2026-09-09', dateModified: '2026-09-09', inLanguage: 'en', keywords: p.keywords, author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID }, isPartOf: { '@id': HOST + '/#website' }, mainEntityOfPage: url },
      { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR, url: HOST, jobTitle: JOBTITLE, sameAs: SAMEAS },
    ];
    if (p.term) {
      graph[0].about = { '@id': url + '#term' };
      graph.push({ '@type': 'DefinedTerm', '@id': url + '#term', name: p.term[0], description: p.term[1], inDefinedTermSet: HOST });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }
  // case study
  return {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, headline: p.title,
    url, image: OGDIR + p.og, description: p.desc, genre: 'UX Case Study', inLanguage: 'en',
    keywords: p.keywords || 'AI product design, UX case study, product strategy, design systems',
    author: { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR, url: HOST, jobTitle: JOBTITLE, sameAs: SAMEAS },
    creator: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@type': 'WebSite', '@id': HOST + '/#website', name: 'David Cervantes', url: HOST },
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
    `<meta name="robots" content="${p.noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}">`,
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
