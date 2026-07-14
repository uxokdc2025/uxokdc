/**
 * support.js — x-dc runtime
 *
 * Implements: <x-dc>, <helmet>, {{ }}, DCLogic, React.createElement shim,
 * style-hover, sc-if, sc-for, <x-import>, and the Seamless DS token layer.
 */
(function () {
  'use strict';

  // ── Seamless DS token injection ──────────────────────────────────────────
  // Inlines the essential CSS custom properties so pages render correctly
  // even when the _ds/ folder is absent (e.g. Vercel production).
  const DS_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Lexend+Deca:wght@300;400;500&display=swap');
    :root {
      --font-display: 'Google Sans', 'Outfit', ui-sans-serif, system-ui, sans-serif;
      --font-sans: 'Lexend Deca', ui-sans-serif, system-ui, sans-serif;
      --color-orange:  #F54900;
      --color-black:   #0D0D0D;
      --color-canvas:  #F2F1EE;
      --color-mid:     #8A8A85;
      --color-border:  #D8D6D0;
      --color-ink:     #3A3935;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 24px;
      --radius-pill: 999px;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    body { margin: 0; font-family: var(--font-sans); }
    a { color: inherit; text-decoration: none; }
    ::selection { background: rgba(245,73,0,.15); }
    x-dc { display: contents; }
    x-import { display: none; }
    sc-if, sc-for { display: contents; }
  `;

  function injectBaseStyles() {
    const style = document.createElement('style');
    style.id = 'x-dc-base';
    style.textContent = DS_CSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // ── React shim ───────────────────────────────────────────────────────────
  // renderVals() may use React.createElement; we resolve to real DOM nodes.
  const React = {
    Fragment: 'x-frag',

    createElement(type, props) {
      const children = Array.prototype.slice.call(arguments, 2).flat(Infinity);

      if (typeof type === 'function') {
        return type(Object.assign({}, props, { children }));
      }

      const tag = type === React.Fragment ? 'span' : type;
      const el = document.createElement(tag);

      if (props) {
        for (const key of Object.keys(props)) {
          const val = props[key];
          if (key === 'key' || val == null) continue;
          if (key === 'className') { el.className = val; continue; }
          if (key === 'htmlFor') { el.setAttribute('for', val); continue; }
          if (key === 'style' && typeof val === 'object') {
            for (const [p, v] of Object.entries(val)) el.style[p] = v;
            continue;
          }
          if (key === 'dangerouslySetInnerHTML') { el.innerHTML = val.__html; continue; }
          if (key.startsWith('on') && typeof val === 'function') {
            el.addEventListener(key[2].toLowerCase() + key.slice(3), val);
            continue;
          }
          if (typeof val === 'boolean') { if (val) el.setAttribute(key, ''); continue; }
          el.setAttribute(key, String(val));
        }
      }

      appendChildren(el, children);
      return el;
    }
  };

  function appendChildren(parent, children) {
    for (const child of children) {
      if (child == null || child === false || child === true) continue;
      if (child instanceof Node) { parent.appendChild(child); continue; }
      if (Array.isArray(child)) { appendChildren(parent, child); continue; }
      parent.appendChild(document.createTextNode(String(child)));
    }
  }

  window.React = React;

  // ── DCLogic base class ───────────────────────────────────────────────────
  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }

    setState(patch) {
      Object.assign(this.state, patch);
      if (typeof this._dc_rerender === 'function') this._dc_rerender();
    }

    renderVals() { return {}; }
    componentDidMount() {}
    componentWillUnmount() {}
  }

  window.DCLogic = DCLogic;

  // ── Icon library ─────────────────────────────────────────────────────────
  const ICON_PATHS = {
    IconMailFill:     'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    IconCheck:        'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    IconArrowRight:   'M12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    IconArrowLeft:    'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    IconArrowUp:      'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z',
    IconArrowDown:    'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z',
    IconExternalLink: 'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59L7.76 14.83l1.41 1.41L19 6.41V10h2V3h-7z',
    IconFigma:        'M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zm7-3.5h3.5a3.5 3.5 0 0 1 0 7H12V2zm0 8.5h3.5a3.5 3.5 0 0 1 0 7H12v-7zm-7 3.5A3.5 3.5 0 0 1 8.5 10.5H12v7H8.5A3.5 3.5 0 0 1 5 14zm3.5 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
    IconStar:         'm12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08z',
    IconClose:        'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    IconMenu:         'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    IconPlay:         'M8 5v14l11-7z',
    IconGrid:         'M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z',
    IconSearch:       'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    IconFilter:       'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
    IconShare:        'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
  };

  function makeIconSVG(name, sizeStr) {
    const px = parseInt(sizeStr) || 20;
    const path = ICON_PATHS[name];
    const inner = path
      ? `<path d="${path}"/>`
      : '<circle cx="12" cy="12" r="5" opacity=".25"/>';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${inner}</svg>`;
  }

  // ── DS component fallbacks ────────────────────────────────────────────────
  // Renders Seamless DS / IntentUI components as styled native elements when
  // the _ds_bundle.js is unavailable (production Vercel deployment).
  function renderDSFallback(xImportEl) {
    const scope = xImportEl.getAttribute('component-from-global-scope') || '';
    const hintSize = xImportEl.getAttribute('hint-size') || '20px,20px';
    const [wStr] = hintSize.split(',').map(s => s.trim());
    const px = parseInt(wStr) || 20;

    // ── Icon ──
    if (/\.Icon$|^Icon/.test(scope)) {
      const name = xImportEl.getAttribute('name') || '';
      const wrap = document.createElement('span');
      wrap.style.cssText = `display:inline-flex;width:${px}px;height:${px}px;align-items:center;justify-content:center;flex-shrink:0;`;
      wrap.innerHTML = makeIconSVG(name, px);
      return wrap;
    }

    // ── Button ──
    if (/\.Button$/.test(scope)) {
      const intent = xImportEl.getAttribute('intent') || 'secondary';
      const size   = xImportEl.getAttribute('size')   || 'md';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = xImportEl.textContent.trim() || xImportEl.getAttribute('label') || '';
      const pad   = size === 'lg' ? '14px 28px' : size === 'sm' ? '8px 18px' : '11px 22px';
      const fSize = size === 'lg' ? '15px' : size === 'sm' ? '13px' : '14px';
      const isPrimary = intent === 'primary';
      btn.style.cssText = [
        'display:inline-flex', 'align-items:center', 'justify-content:center', 'gap:8px',
        `font:500 ${fSize}/1 var(--font-display,'Google Sans',sans-serif)`,
        'cursor:pointer', 'border-radius:999px', `padding:${pad}`,
        'transition:background 150ms,color 150ms,border-color 150ms',
        isPrimary
          ? 'background:#F54900;color:#F2F1EE;border:1.5px solid #F54900'
          : 'background:#fff;color:#0D0D0D;border:1.5px solid #D8D6D0',
      ].join(';');
      if (isPrimary) {
        btn.addEventListener('mouseenter', () => { btn.style.background = '#d93e00'; btn.style.borderColor = '#d93e00'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = '#F54900'; btn.style.borderColor = '#F54900'; });
      } else {
        btn.addEventListener('mouseenter', () => { btn.style.color = '#F54900'; btn.style.borderColor = '#F54900'; });
        btn.addEventListener('mouseleave', () => { btn.style.color = '#0D0D0D'; btn.style.borderColor = '#D8D6D0'; });
      }
      return btn;
    }

    // ── Badge / Tag ──
    if (/\.Badge$|\.Tag$/.test(scope)) {
      const span = document.createElement('span');
      span.textContent = xImportEl.textContent.trim() || xImportEl.getAttribute('label') || '';
      span.style.cssText = 'display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font:500 12px var(--font-sans);background:#F2F1EE;border:0.5px solid #D8D6D0;color:#0D0D0D;';
      return span;
    }

    // ── Generic: sized transparent span ──
    const span = document.createElement('span');
    span.style.cssText = `display:inline-flex;width:${wStr};min-height:${hintSize.split(',')[1]?.trim() || wStr};align-items:center;`;
    span.textContent = xImportEl.textContent.trim();
    return span;
  }

  // ── x-import resolution ───────────────────────────────────────────────────
  const loadedModules = new Map(); // from-path → Promise

  async function resolveXImports(root) {
    const list = Array.from(root.querySelectorAll('x-import'));
    if (!list.length) return;

    // Phase 1: kick off all local module loads in parallel
    const localLoads = [];
    for (const el of list) {
      const from = el.getAttribute('from');
      if (!from) continue;
      if (!loadedModules.has(from)) {
        const p = import(from).catch(() => null);
        loadedModules.set(from, p);
        localLoads.push(p);
      }
    }
    if (localLoads.length) await Promise.all(localLoads);

    // Phase 2: replace each x-import
    for (const el of list) {
      if (!el.isConnected) continue; // already replaced in a nested call
      const from  = el.getAttribute('from');
      const scope = el.getAttribute('component-from-global-scope') || '';

      let replacement;

      if (from) {
        // Local custom element — derive tag name from component-from-global-scope
        // or filename (e.g. "./image-slot.js" → "image-slot")
        const tagName = scope.includes('.')
          ? scope                          // e.g. "image-slot"
          : from.replace(/.*\//, '').replace(/\.[jt]s$/, '');

        const customEl = document.createElement(tagName);
        for (const attr of Array.from(el.attributes)) {
          const skip = ['component-from-global-scope', 'from', 'hint-size'];
          if (skip.includes(attr.name)) continue;
          customEl.setAttribute(attr.name, attr.value);
        }
        if (el.style.cssText) customEl.style.cssText = el.style.cssText;
        while (el.firstChild) customEl.appendChild(el.firstChild);
        replacement = customEl;
      } else {
        // Design-system component — render a styled native fallback
        replacement = renderDSFallback(el);
        if (el.style.cssText) {
          // Merge positional styles from the x-import onto the fallback
          replacement.style.cssText = el.style.cssText + ';' + replacement.style.cssText;
        }
      }

      el.parentNode.replaceChild(replacement, el);
    }
  }

  // ── style-hover ───────────────────────────────────────────────────────────
  function parseInlineStyle(str) {
    const out = {};
    for (const decl of (str || '').split(';')) {
      const colon = decl.indexOf(':');
      if (colon < 0) continue;
      const prop = decl.slice(0, colon).trim();
      const val  = decl.slice(colon + 1).trim();
      if (prop) out[cssToCamel(prop)] = val;
    }
    return out;
  }

  function cssToCamel(prop) {
    return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  function attachStyleHovers(root) {
    for (const el of Array.from(root.querySelectorAll('[style-hover]'))) {
      const hover = parseInlineStyle(el.getAttribute('style-hover'));
      const base  = {};
      for (const k of Object.keys(hover)) base[k] = el.style[k] || '';
      el.addEventListener('mouseenter', () => { for (const [k, v] of Object.entries(hover)) el.style[k] = v; });
      el.addEventListener('mouseleave', () => { for (const [k, v] of Object.entries(base))  el.style[k] = v; });
      el.removeAttribute('style-hover');
    }
  }

  // ── Template interpolation ────────────────────────────────────────────────
  const EXPR_RE        = /\{\{([\s\S]+?)\}\}/g;
  const SINGLE_EXPR_RE = /^\s*\{\{([\s\S]+?)\}\}\s*$/;

  function evalExpr(expr, vals) {
    const key = expr.trim();
    if (Object.prototype.hasOwnProperty.call(vals, key)) return vals[key];
    try {
      return new Function(...Object.keys(vals), `return (${key})`)(...Object.values(vals));
    } catch (_) {
      return '';
    }
  }

  function interpolateToString(template, vals) {
    return template.replace(EXPR_RE, (_, expr) => {
      const v = evalExpr(expr, vals);
      if (v == null || typeof v === 'function' || typeof v === 'object') return '';
      return String(v);
    });
  }

  function walkDOM(node, vals) {
    switch (node.nodeType) {

      case Node.TEXT_NODE: {
        const text = node.textContent;
        if (!text.includes('{{')) return;
        const single = text.match(SINGLE_EXPR_RE);
        if (single) {
          const val = evalExpr(single[1], vals);
          if (val instanceof Node) {
            node.parentNode.replaceChild(val, node);
            return;
          }
          if (Array.isArray(val)) {
            const frag = document.createDocumentFragment();
            appendChildren(frag, val.flat(Infinity));
            node.parentNode.replaceChild(frag, node);
            return;
          }
          node.textContent = val == null ? '' : String(val);
        } else {
          node.textContent = interpolateToString(text, vals);
        }
        return;
      }

      case Node.ELEMENT_NODE: {
        const el  = node;
        const tag = el.tagName.toLowerCase();

        // ── sc-if ──
        if (tag === 'sc-if') {
          const raw    = el.getAttribute('value') || '';
          const single = raw.match(SINGLE_EXPR_RE);
          const show   = single ? Boolean(evalExpr(single[1], vals)) : (raw !== 'false' && raw !== '');
          if (show) {
            const frag = document.createDocumentFragment();
            while (el.firstChild) frag.appendChild(el.firstChild);
            el.parentNode.replaceChild(frag, el);
            walkDOM(frag, vals);
          } else {
            el.remove();
          }
          return;
        }

        // ── sc-for ──
        if (tag === 'sc-for') {
          const listRaw  = el.getAttribute('value') || el.getAttribute('for') || '[]';
          const itemVar  = el.getAttribute('item') || 'item';
          const indexVar = el.getAttribute('index') || '_idx';
          const single   = listRaw.match(SINGLE_EXPR_RE);
          const list     = single ? evalExpr(single[1], vals) : [];
          if (Array.isArray(list) && list.length) {
            const tmplHTML = el.innerHTML;
            const frag = document.createDocumentFragment();
            list.forEach((item, idx) => {
              const tmp = document.createElement('div');
              tmp.innerHTML = tmplHTML;
              walkDOM(tmp, Object.assign({}, vals, { [itemVar]: item, [indexVar]: idx }));
              while (tmp.firstChild) frag.appendChild(tmp.firstChild);
            });
            el.parentNode.replaceChild(frag, el);
          } else {
            el.remove();
          }
          return;
        }

        // ── attributes ──
        for (const attr of Array.from(el.attributes)) {
          if (!attr.value.includes('{{')) continue;
          const name   = attr.name;
          const lcName = name.toLowerCase();

          if (lcName.startsWith('on')) {
            // Event handler — bind function, remove attribute
            const single = attr.value.match(SINGLE_EXPR_RE);
            if (single) {
              const fn = evalExpr(single[1], vals);
              if (typeof fn === 'function') {
                el.addEventListener(lcName.slice(2), fn);
              }
            }
            el.removeAttribute(name);
          } else {
            el.setAttribute(name, interpolateToString(attr.value, vals));
          }
        }

        // ── recurse (snapshot first to guard against live-list mutation) ──
        for (const child of Array.from(el.childNodes)) walkDOM(child, vals);
        return;
      }

      case Node.DOCUMENT_FRAGMENT_NODE: {
        for (const child of Array.from(node.childNodes)) walkDOM(child, vals);
        return;
      }
    }
  }

  // ── Helmet ────────────────────────────────────────────────────────────────
  function processHelmet(xdc) {
    for (const helmet of Array.from(xdc.querySelectorAll('helmet'))) {
      for (const child of Array.from(helmet.childNodes)) {
        // Skip the _ds bundle links that won't resolve in production
        if (child.nodeType === Node.ELEMENT_NODE) {
          const href = child.getAttribute('href') || child.getAttribute('src') || '';
          if (href.includes('/_ds/') || href.includes('_ds_bundle')) {
            // still append — the 404 is silent and the inline tokens cover what's needed
          }
        }
        document.head.appendChild(child.cloneNode(true));
      }
      helmet.remove();
    }
  }

  // ── Props schema ──────────────────────────────────────────────────────────
  function parsePropsSchema(scriptTag) {
    try {
      const schema = JSON.parse(scriptTag.getAttribute('data-props') || '{}');
      const props = {};
      for (const [k, def] of Object.entries(schema)) {
        if (def.default !== undefined) props[k] = def.default;
      }
      return props;
    } catch (_) {
      return {};
    }
  }

  // ── Main boot ─────────────────────────────────────────────────────────────
  async function boot() {
    injectBaseStyles();

    const xdc = document.querySelector('x-dc');
    if (!xdc) return;

    // 1. Move helmet into <head>, then snapshot the clean template
    processHelmet(xdc);
    const templateHTML = xdc.innerHTML;

    // 2. Find component script
    const scriptTag = document.querySelector('script[type="text/x-dc"][data-dc-script]');

    if (!scriptTag) {
      // Static page — just wire up hovers and local imports
      attachStyleHovers(xdc);
      await resolveXImports(xdc);
      return;
    }

    // 3. Parse props + instantiate component
    const props = parsePropsSchema(scriptTag);
    let ComponentClass;
    try {
      const factory = new Function('DCLogic', 'React',
        scriptTag.textContent + '\nreturn typeof Component !== "undefined" ? Component : null;'
      );
      ComponentClass = factory(DCLogic, React);
    } catch (err) {
      console.error('[x-dc] Component eval error:', err);
      return;
    }

    if (!ComponentClass) {
      console.warn('[x-dc] No Component class found in script');
      return;
    }

    const instance = new ComponentClass(props);

    // 4. RAF-debounced render — collapses rapid setState bursts (scroll events etc.)
    let rafId = null;

    async function render() {
      let vals = {};
      try { vals = instance.renderVals() || {}; } catch (err) {
        console.error('[x-dc] renderVals error:', err);
      }

      // Reset DOM from the clean template snapshot
      xdc.innerHTML = templateHTML;

      // Interpolate — this handles sc-if / sc-for / {{ }} / on* in one pass
      walkDOM(xdc, vals);

      // Post-process: style-hovers and component imports
      attachStyleHovers(xdc);
      await resolveXImports(xdc);
    }

    instance._dc_rerender = function () {
      if (rafId) return;
      rafId = requestAnimationFrame(async () => {
        rafId = null;
        await render();
      });
    };

    // 5. Initial synchronous-ish render (awaited so imports settle before mount)
    await render();

    // 6. Lifecycle
    try { instance.componentDidMount(); } catch (err) {
      console.error('[x-dc] componentDidMount error:', err);
    }

    window.addEventListener('beforeunload', () => {
      try { instance.componentWillUnmount(); } catch (_) {}
    }, { once: true });
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
