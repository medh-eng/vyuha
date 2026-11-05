/* VYUHA — Sanjaya's Scroll (Chapter IV · Rang, docs/LOOK.md)
 * At the end of a battle the best moments become one tall painted strip, the
 * way a Phad cloth tells an epic panel by panel. Drawn on the phone in a canvas
 * from the Pata paintings; nothing is uploaded. Share sends the PNG where the
 * phone allows it (WhatsApp on Android), or it is saved as a file.
 */
(function (root) {
  'use strict';
  const AC = (root.AC = root.AC || {});

  const W = 1080;
  const INK = '#1c1510', COTTON = '#f8efd9', VERM = '#c8341c', SAFF = '#ee8f1c', LAPIS = '#2c58a8', GOLD = '#a8650a';
  const SLUG = {
    '10': 'senapati', '9': 'maharathi', '7': 'ashvarohi', '6': 'dhanurdhar', '5': 'divyadrishti',
    '3': 'yantrik', '2': 'rath', '1': 'chara', 'B': 'shataghni', 'F': 'durg'
  };
  const ASTRA = {
    vayavya: ['वायव्यास्त्र', 'the wind astra'], sammohana: ['सम्मोहनास्त्र', 'the trance astra'],
    agneya: ['आग्नेयास्त्र', 'the fire astra'], brahma: ['ब्रह्मास्त्र', 'the light astra']
  };

  /* Moments are kept as the battle goes (game.js calls note()); the scroll picks
     the opening blow, the gate, the first astra, the heaviest fall and the end. */
  function pick(moments) {
    const out = [];
    const add = function (m) { if (m && out.indexOf(m) === -1) out.push(m); };
    add(moments.find(function (m) { return m.kind === 'clash'; }));
    add(moments.find(function (m) { return m.kind === 'breach'; }));
    add(moments.find(function (m) { return m.kind === 'astra'; }));
    const falls = moments.filter(function (m) { return m.kind === 'clash' && m.outcome !== 'none'; });
    falls.sort(function (a, b) { return rankOf(b.fallen) - rankOf(a.fallen); });
    add(falls[0]);
    const last = moments.filter(function (m) { return m.kind === 'core' || m.kind === 'clash'; }).pop();
    add(last);
    out.sort(function (a, b) { return a.seq - b.seq; });
    return out.slice(0, 5);
  }
  function rankOf(u) {
    if (!u) return -1;
    const r = { '10': 10, '9': 9, '7': 7, '6': 6, '5': 5, '3': 3, '2': 2, '1': 1, 'B': 4, 'F': 11 }[u.key];
    return r == null ? 0 : r;
  }

  function art(key, owner, state) {
    if (!SLUG[key]) return null;
    return 'assets/art/pata/pieces/' + (owner === 2 ? 'chandra' : 'surya') + '-' + SLUG[key] + (key === 'F' && state ? '-' + state : '') + '.webp';
  }
  // a fort is drawn as it stands in that moment: its gate broken, or fallen
  function fortState(m) {
    if (!m.def || m.def.key !== 'F') return null;
    if (m.kind === 'breach') return 'broken';
    if (m.kind === 'core' || (m.kind === 'clash' && m.outcome === 'att')) return 'fallen';
    return null;
  }
  function load(url) {
    return new Promise(function (resolve) {
      if (!url) { resolve(null); return; }
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }
  function army(owner) { return owner === 1 ? 'Surya' : 'Chandra'; }
  function name(u) {
    const L = AC.i18n;
    const n = L && L.unit ? L.unit(u.key).name : u.name;
    return n || u.name || 'warrior';
  }

  function caption(m) {
    if (m.kind === 'astra') {
      const a = ASTRA[m.astra] || ['अस्त्र', 'an astra'];
      return { deva: a[0], line: army(m.owner) + ' called on ' + a[1] + '.' };
    }
    if (m.kind === 'breach') return { deva: 'द्वार भंग', line: 'The ' + name(m.att) + ' of ' + army(m.att.owner) + ' broke the gate of the ' + army(m.def.owner) + ' fort.' };
    if (m.kind === 'core' || (m.kind === 'clash' && m.outcome === 'att' && m.def && m.def.key === 'F')) return { deva: 'दुर्ग पतन', line: 'The ' + name(m.att) + ' of ' + army(m.att.owner) + ' took the fort. The field is decided.' };
    const a = 'the ' + name(m.att) + ' of ' + army(m.att.owner), d = 'the ' + name(m.def) + ' of ' + army(m.def.owner);
    if (m.outcome === 'att') return { deva: 'विजय', line: cap(a) + ' struck down ' + d + '.' };
    if (m.outcome === 'def') return { deva: 'प्रतिघात', line: cap(a) + ' fell against ' + d + '.' };
    if (m.outcome === 'both') return { deva: 'वीरगति', line: cap(a) + ' and ' + d + ' fell together.' };
    return { deva: 'द्वंद्व', line: cap(a) + ' met ' + d + ', and both stood.' };
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function wrap(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(function (w) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    });
    if (line) lines.push(line);
    return lines;
  }
  function frame(ctx, x, y, w, h) {
    ctx.fillStyle = COTTON; ctx.fillRect(x, y, w, h);
    ctx.lineWidth = 8; ctx.strokeStyle = VERM; ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.strokeRect(x + 16, y + 16, w - 32, h - 32);
  }
  function disc(ctx, img, cx, cy, r, owner) {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#fbf3df'; ctx.fill();
    ctx.lineWidth = 9; ctx.strokeStyle = owner === 1 ? VERM : LAPIS;
    if (owner === 1) ctx.setLineDash([22, 11]);
    ctx.stroke(); ctx.restore();
    if (img) { const s = r * 1.66; ctx.drawImage(img, cx - s / 2, cy - s / 2 - r * 0.04, s, s); }
  }

  async function make(info) {
    const panels = pick(info.moments || []);
    const PH = 340, HEAD = 300, FOOT = 230, GAP = 26;
    const H = Math.min(2400, HEAD + panels.length * (PH + GAP) + FOOT);
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { /* draw with what we have */ } }
    const [cloth, sanjaya, border] = await Promise.all([
      load('assets/art/pata/frame/cloth-cotton.webp'),
      load('assets/art/pata/portraits/sanjaya.webp'),
      load('assets/art/pata/frame/border-chakra.webp')
    ]);
    const pieces = await Promise.all(panels.map(function (m) {
      return Promise.all([load(m.att ? art(m.att.key, m.att.owner) : null), load(m.def ? art(m.def.key, m.def.owner, fortState(m)) : null)]);
    }));

    // the cloth
    ctx.fillStyle = '#efe0bd'; ctx.fillRect(0, 0, W, H);
    if (cloth) { const pat = ctx.createPattern(cloth, 'repeat'); if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H); } }
    ctx.lineWidth = 14; ctx.strokeStyle = VERM; ctx.strokeRect(7, 7, W - 14, H - 14);

    // the heading: Sanjaya tells it
    if (border) { for (let x = 0; x < W; x += border.width * (60 / border.height)) ctx.drawImage(border, x, 22, border.width * (60 / border.height), 60); }
    if (sanjaya) {
      ctx.save(); ctx.beginPath(); ctx.arc(150, 190, 86, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = '#f3dcae'; ctx.fillRect(64, 104, 172, 172);
      ctx.drawImage(sanjaya, 64, 104, 172, 172); ctx.restore();
      ctx.lineWidth = 6; ctx.strokeStyle = SAFF; ctx.beginPath(); ctx.arc(150, 190, 86, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic';
    ctx.font = '64px "Tiro Devanagari Hindi", "Rozha One", serif';
    ctx.fillText('संजय का पट', 270, 180);
    ctx.font = '600 34px Inter, system-ui, sans-serif'; ctx.fillStyle = '#5e4b38';
    ctx.fillText(info.title || 'A battle on the field', 272, 232);
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillText(info.sub || '', 272, 272);

    // the panels
    panels.forEach(function (m, i) {
      const y = HEAD + i * (PH + GAP);
      frame(ctx, 48, y, W - 96, PH);
      const imgs = pieces[i];
      const cap1 = caption(m);
      ctx.fillStyle = VERM; ctx.font = '600 26px Inter, system-ui, sans-serif';
      ctx.fillText('ROUND ' + (m.round || 1) + (m.hour ? ' · ' + (m.hour === 'night' ? 'RATRI' : 'SURYA') : ''), 92, y + 64);
      if (m.kind === 'astra') {
        disc(ctx, null, 220, y + 190, 92, m.owner);
        ctx.fillStyle = m.owner === 1 ? VERM : LAPIS; ctx.font = '120px serif'; ctx.textAlign = 'center';
        ctx.fillText('✦', 220, y + 232); ctx.textAlign = 'left';
      } else {
        if (m.att) disc(ctx, imgs[0], 180, y + 196, 84, m.att.owner);
        if (m.def) disc(ctx, imgs[1], 420, y + 196, 84, m.def.owner);
        if (m.att && m.def) {
          ctx.fillStyle = INK; ctx.font = '700 40px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('×', 300, y + 210); ctx.textAlign = 'left';
        }
      }
      const tx = 540;
      ctx.fillStyle = m.kind === 'clash' && m.outcome === 'def' ? VERM : GOLD;
      ctx.font = '64px "Tiro Devanagari Hindi", "Rozha One", serif';
      ctx.fillText(cap1.deva, tx, y + 150);
      ctx.fillStyle = INK; ctx.font = '30px Inter, system-ui, sans-serif';
      wrap(ctx, cap1.line, W - tx - 92).slice(0, 4).forEach(function (l, k) { ctx.fillText(l, tx, y + 204 + k * 40); });
    });

    // the end
    const fy = H - FOOT + 10;
    ctx.textAlign = 'center';
    ctx.fillStyle = info.outcome === 'loss' ? VERM : info.outcome === 'draw' ? LAPIS : GOLD;
    ctx.font = '96px "Tiro Devanagari Hindi", "Rozha One", serif';
    ctx.fillText(info.outcome === 'loss' ? 'पराजय' : info.outcome === 'draw' ? 'समान' : 'विजय', W / 2, fy + 90);
    ctx.fillStyle = INK; ctx.font = '600 32px Inter, system-ui, sans-serif';
    ctx.fillText(info.result || '', W / 2, fy + 142);
    ctx.fillStyle = '#5e4b38'; ctx.font = '26px Inter, system-ui, sans-serif';
    ctx.fillText('VYUHA · व्यूह · ' + (info.url || 'medh-eng.github.io/vyuha'), W / 2, fy + 188);
    ctx.textAlign = 'left';

    return new Promise(function (resolve) { c.toBlob(function (blob) { resolve({ blob: blob, url: blob ? URL.createObjectURL(blob) : c.toDataURL('image/png'), panels: panels.length }); }, 'image/png'); });
  }

  async function share(res, text) {
    const file = res.blob && typeof File !== 'undefined' ? new File([res.blob], 'vyuha-sanjaya-scroll.png', { type: 'image/png' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: text }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
    }
    const a = document.createElement('a');
    a.href = res.url; a.download = 'vyuha-sanjaya-scroll.png';
    document.body.appendChild(a); a.click(); a.remove();
    return 'saved';
  }

  AC.scroll = { make: make, share: share, pick: pick, caption: caption };
})(typeof globalThis !== 'undefined' ? globalThis : this);
