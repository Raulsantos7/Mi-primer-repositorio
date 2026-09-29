// Te amo, Sofía — video en acuarela (modo historia). Un blob rosita cruza todo el video; Sofía aparece dibujada.
import * as L from './engine/lib.js';
import { title, para, layoutRich } from './engine/base.js';
import { skin, giftBox, mug, flag, bubble, confetti, panelBorder } from './props.js';

const W = 1920, H = 1080, FLOOR = 900;
const ROSE = '#D9657F', ROSE2 = '#E8A0AE', BLUSH = '#F2C4CC', GOLD = '#E9B44C', SAGE = '#8FA7A1', SKY = '#9CC3D5', LILA = '#A99BD1';
const HL = 'rgba(232,150,165,.45)';

// ---------- texto ----------
const T = (K, str, box, p, o = {}) => title(K, str, box, p, { font: sz => K.S.type.display(sz), emFont: sz => (K.S.type.em || K.S.type.display)(sz), color: K.P.ink, emColor: K.P.accent, align: 'center', ...o });
function lay(K, str, box, o = {}) {
  const R = layoutRich(K.ctx, K.rich(str), box, { font: sz => K.S.type.display(sz), emFont: sz => (K.S.type.em || K.S.type.display)(sz), max: (o.max || 190) * K.u, min: 18 * K.u, lh: K.S.lh ?? 1.02, ls: K.S.ls ?? -0.02, upper: K.S.upper });
  const tot = R.lines.length * R.lh, y0 = box.y + (box.h - tot) / 2, em = [];
  R.lines.forEach((ln, i) => { const x0 = o.align === 'left' ? box.x : box.x + (box.w - R.widths[i]) / 2; ln.forEach(t => t.em && em.push({ x: x0 + t.x - 8, y: y0 + i * R.lh + R.size * 0.18, w: t.width + 16, h: R.size * 0.78 })); });
  return { n: R.lines.length, em, box: { x: box.x, y: y0, w: box.w, h: tot } };
}
// título escrito a mano con pasada de color sobre las *palabras*
function TW(K, str, box, p, o = {}, tool = 'pencil') { const lo = lay(K, str, box, o); lo.em.forEach(r => L.highlightOn(K.ctx, r, L.clamp((p - 0.8) / 0.3), HL, { tool: false })); L.writeOn(K.ctx, () => T(K, str, box, 1, o), lo.box, L.clamp(p / 0.8), { tool, lines: lo.n }); }
const HAND = (K, str, box, p, o = {}) => para(K, str, box, p, { font: sz => K.S.type.hand(sz), color: '#9A4127', max: 64, align: 'center', ...o });

// ---------- corazones de acuarela ----------
const HEART = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2, s = Math.sin(a); return [16 * s * s * s / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17]; });
const HCANVAS = L.memo((r, color, seed) => { const c = L.canvas(r * 2 + 120, r * 2 + 120), x = c.getContext('2d'); L.watercolor(x, HEART.map(([a, b]) => [r + 60 + a * r, r + 60 + b * r]), color, { seed: +seed, layers: 24, alpha: 0.075, amp: 0.1 }); return c; });
function heart(K, cx, cy, r, color = ROSE, { p = 1, seed = 1, rot = 0, ink = true } = {}) {
  const e = L.E.back(L.clamp(p)); if (e <= 0.01) return; const ctx = K.ctx, R = Math.max(20, Math.round(r / 20) * 20), c = HCANVAS(R, color, seed), k = r / R * e;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(k, k); ctx.drawImage(c, -R - 60, -R - 60);
  if (ink) L.inkPath(ctx, HEART.map(([a, b]) => [a * R, b * R]), { w: 3.4 / k * K.u * Math.min(1, k * 1.6), color: '#241D18', seed: Math.floor(K.t * 8) + seed, closed: true, jitter: 1.2 / k });
  ctx.restore();
}
// corazones que suben como globos / vapor
function floatHearts(K, t0, t, x0, y0, n, { spread = 260, rise = 520, seed = 3, size = 34, colors = [ROSE, ROSE2, '#C9506B'] } = {}) {
  const r = L.rng(seed);
  for (let k = 0; k < n; k++) { const at = t0 + r() * 1.6, dx = (r() - 0.5) * spread, sz = size * (0.6 + r() * 0.8), ph = r() * 6, col = colors[k % colors.length]; const q = t - at; if (q < 0) continue;
    const life = 2.6, a = q / life; if (a > 1) continue; K.ctx.save(); K.ctx.globalAlpha = L.clamp((1 - a) * 2.5);
    heart(K, x0 + dx * L.E.out(L.clamp(a * 2)) + Math.sin(q * 3 + ph) * 18, y0 - rise * L.E.out(a), sz, col, { p: q / 0.35, seed: 10 + k, rot: Math.sin(q * 2 + ph) * 0.2, ink: sz > 26 }); K.ctx.restore(); }
}
const sparkle = (K, x, y, r, p, color = GOLD) => { if (p <= 0) return; const ctx = K.ctx; ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = L.clamp(Math.sin(L.clamp(p) * Math.PI) * 1.5); L.star(ctx, x, y, r * Math.sin(L.clamp(p) * Math.PI), 4, 0.3); ctx.fill(); ctx.restore(); };

// ---------- escenarios ----------
const WC = L.memo((kind, w, h, color, seed) => { const c = L.canvas(+w + 160, +h + 160), x = c.getContext('2d'); L.watercolor(x, kind === 'c' ? L.circlePoly(80 + w / 2, 80 + h / 2, w / 2, h / 2, 18) : L.rectPoly(80, 80, +w, +h), color, { seed: +seed, layers: 24, alpha: 0.06, amp: 0.14 }); return c; });
const blot = (K, kind, x, y, w, h, color, seed = 1) => K.ctx.drawImage(WC(kind, Math.round(w), Math.round(h), color, seed), x - 80, y - 80);
const HILL = x => FLOOR - 420 * Math.exp(-Math.pow((x - 1450) / 520, 2));
const HILLC = L.memo(() => { const c = L.canvas(W, H), x = c.getContext('2d'); const pts = []; for (let k = -40; k <= W + 40; k += 40) pts.push([k, HILL(k)]); pts.push([W + 60, H + 60], [-60, H + 60]); L.watercolor(x, pts, SAGE, { seed: 4, layers: 26, alpha: 0.07, amp: 0.04 }); return c; });
function umbrella(K, x, y, r, p, sk) { if (p <= 0) return; const ctx = K.ctx, e = L.E.back(L.clamp(p)); ctx.save(); ctx.translate(x, y); ctx.scale(e, e);
  const top = new Path2D(); top.moveTo(-r, 0); top.bezierCurveTo(-r, -r * 0.95, r, -r * 0.95, r, 0); for (let k = 3; k >= 0; k--) { const a = -r + (k + 1) * r / 2, b = -r + k * r / 2; top.quadraticCurveTo((a + b) / 2, -r * 0.16, b, 0); } top.closePath();
  sk.fill(top, ROSE); sk.stroke(top); const hd = new Path2D(); hd.moveTo(0, -r * 0.7); hd.lineTo(0, r * 1.05); hd.quadraticCurveTo(0, r * 1.25, -r * 0.16, r * 1.2); sk.stroke(hd, 1.3); ctx.restore(); }
function flower(K, x, y, r, p, color, sk, seed = 1) { if (p <= 0) return; const ctx = K.ctx, e = L.E.back(L.clamp(p)), st = new Path2D(); st.moveTo(x, y + r * 3.2); st.quadraticCurveTo(x - r * 0.4, y + r * 1.6, x, y); ctx.save(); ctx.globalAlpha = L.clamp(p * 3); sk.stroke(st, 0.9); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(seed); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2, pe = new Path2D(); pe.ellipse(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.5, r * 0.36, a, 0, 7); sk.fill(pe, color); sk.stroke(pe, 0.6); }
  const c = new Path2D(); c.arc(0, 0, r * 0.3, 0, 7); sk.fill(c, GOLD); sk.stroke(c, 0.6); ctx.restore(); }
function medal(K, x, y, r, p, sk) { if (p <= 0) return; const ctx = K.ctx, e = L.E.back(L.clamp(p)); ctx.save(); ctx.translate(x, y); ctx.rotate((1 - e) * 1.2 - 0.12); ctx.scale(e, e);
  for (const s of [-1, 1]) { const rb = new Path2D(); rb.moveTo(s * r * 0.15, 0); rb.lineTo(s * r * 0.75, r * 1.7); rb.lineTo(s * r * 0.4, r * 1.45); rb.lineTo(s * r * 0.2, r * 1.8); rb.lineTo(s * r * -0.2, r * 0.2); rb.closePath(); sk.fill(rb, ROSE); sk.stroke(rb, 0.8); }
  const m = new Path2D(); m.arc(0, 0, r, 0, 7); sk.fill(m, GOLD); sk.stroke(m); ctx.restore(); heart(K, x, y + 4, r * 0.55, ROSE, { p: (p - 0.3) / 0.4, seed: 71 }); }
function bench(K, x, y, w, sk) { const seat = new Path2D(); seat.rect(x, y, w, 26); sk.fill(seat, '#B07A55'); sk.stroke(seat); const back = new Path2D(); back.rect(x + 20, y - 150, w - 40, 22); back.rect(x + 20, y - 95, w - 40, 22); sk.fill(back, '#B07A55'); sk.stroke(back);
  const legs = new Path2D(); for (const lx of [x + 40, x + w - 40]) { legs.moveTo(lx, y + 26); legs.lineTo(lx, FLOOR + 20); legs.moveTo(lx, y); legs.lineTo(lx, y - 150); } sk.stroke(legs, 1.3); }
function lock(K, x, y, s, sk) { const b = new Path2D(); b.roundRect(x - s * 0.5, y - s * 0.2, s, s * 0.8, s * 0.12); const sh = new Path2D(); sh.moveTo(x - s * 0.3, y - s * 0.2); sh.lineTo(x - s * 0.3, y - s * 0.45); sh.arc(x, y - s * 0.45, s * 0.3, Math.PI, 0); sh.lineTo(x + s * 0.3, y - s * 0.2); sk.stroke(sh, 1.4); sk.fill(b, GOLD); sk.stroke(b); }

// ---------- actuación ----------
const walk = t => ({ walk: t * 18, armL: 25 + 20 * Math.sin(t * 18), armR: 25 - 20 * Math.sin(t * 18), hop: Math.abs(Math.sin(t * 9)) * 8 });
const clap = t => ({ armL: 55 + 18 * Math.sin(t * 16), armR: 55 + 18 * Math.sin(t * 16), eyes: 'happy', hop: Math.abs(Math.sin(t * 8)) * 10 });
const cheer = t => ({ armL: 70, armR: 70, hop: Math.abs(Math.sin(t * 8)) * 26, eyes: 'happy' });

export default {
  style: 'acuarela', format: '16:9', fps: 30, camera: false, chrome: false, captions: false,
  palette: { accent: '#C24D66' },
  person: { name: 'Sofía', look: { skin: '#E6B593', hair: '#3A2418', hairStyle: 'long', shirt: '#D98A9A', glasses: false, beard: false } },
  mascot: 'blob', mascotColor: '#EE94A6', actor: { x: 960, y: FLOOR, h: 180 },
  scenes: [
    // 1 · la caja de regalo: el blob la abre y salen corazones
    { type: 'story', dur: 5.6, say: 'Sofía, te amo, y quiero decirte por qué.',
      render(K, s, h) { const sk = skin(K), t = s.t, open = L.E.back(L.clamp((t - 1.7) / 0.5));
        TW(K, 'Sofía, *te amo*', { x: 360, y: 60, w: 1200, h: 230 }, (t - 0.2) / 1.3, {}, 'brush'); h.cue('title', 0.2);
        floatHearts(K, 1.8, t, 1060, FLOOR - 190, 14, { spread: 520, rise: 230, seed: 5 }); if (t > 1.7) h.cue('pop', 1.8);
        giftBox(K, 1060, FLOOR, 300, open, sk);
        HAND(K, 'y quiero decirte por qué…', { x: 460, y: 300, w: 1000, h: 90 }, h.A(3.0, 0.8)); },
      actor(t) { if (t < 0.6) return { x: 560, y: FLOOR, h: 170, pose: { eyes: 'dot' } }; if (t < 1.5) return { x: L.lerp(560, 820, L.E.inOut((t - 0.6) / 0.9)), y: FLOOR, h: 170, pose: walk(t) };
        if (t < 2.2) return { x: 820, y: FLOOR, h: 170, pose: { armR: 70, armL: 30, look: [1, -0.5], eyes: 'wide' } }; return { x: 800, y: FLOOR, h: 170, pose: { ...clap(t), look: [0.6, -0.6] } }; } },

    // 2 · la taza: el vapor son corazones
    { type: 'story', dur: 5.6, trans: { type: 'iris', x: 0.42, y: 0.75, dur: 0.8 }, say: 'Por tu forma de tratarme.',
      render(K, s, h) { const sk = skin(K), t = s.t; blot(K, 'c', 1080, 330, 560, 520, BLUSH, 21);
        TW(K, 'Por tu forma de *tratarme*', { x: 110, y: 110, w: 900, h: 300 }, (t - 0.3) / 1.4, { align: 'left', max: 120 }, 'pen'); h.cue('title', 0.3);
        HAND(K, 'con paciencia, con ternura, con amor', { x: 110, y: 430, w: 820, h: 90 }, h.A(2.2, 0.8), { align: 'left' });
        const c = K.ctx; c.save(); c.translate(1360, FLOOR); c.scale(4, 4); mug(K, 0, 0, 0, sk); c.restore();
        floatHearts(K, 0.6, t, 1360, FLOOR - 360, 10, { spread: 110, rise: 380, seed: 9, size: 30 }); floatHearts(K, 2.6, t, 1360, FLOOR - 360, 8, { spread: 130, rise: 380, seed: 12, size: 26 }); },
      actor(t) { return { x: 900, y: FLOOR, h: 170, pose: { armL: 20, armR: 45 + 6 * Math.sin(t * 3), rot: -0.08 + 0.03 * Math.sin(t * 2), eyes: t > 1.2 ? 'happy' : 'dot', look: [1, -0.3] } }; } },

    // 3 · la colina: el blob sube y clava la bandera
    { type: 'story', dur: 6.2, trans: { type: 'pan', dur: 0.8 }, say: 'Porque nunca te rindes.',
      render(K, s, h) { const sk = skin(K), t = s.t; K.ctx.drawImage(HILLC(), 0, 0);
        TW(K, 'Porque *nunca*\nte rindes', { x: 110, y: 90, w: 820, h: 300 }, (t - 0.3) / 1.3, { align: 'left', max: 130 }, 'marker'); h.cue('title', 0.3);
        if (t > 3.9) { const q = L.E.back(L.clamp((t - 3.9) / 0.4)); K.ctx.save(); K.ctx.translate(1500, HILL(1500) + 10); K.ctx.scale(1, q); flag(K, 0, 0, 230, Math.sin(t * 5) * 0.5, sk); K.ctx.restore(); heart(K, 1552, HILL(1500) - 190, 30, ROSE, { p: (t - 4.1) / 0.3, seed: 33 }); h.cue('impact', 3.95); }
        confetti(K, t, 4.2, [ROSE, GOLD, SAGE, ROSE2], { n: 50 }); },
      actor(t) { const q = L.clamp((t - 0.2) / 3.4), x = L.lerp(420, 1400, L.E.inOut(q)); if (t < 3.6) return { x, y: HILL(x) + 22, h: 150, pose: { ...walk(t), rot: -0.25 * Math.sin(Math.min(1, q * 1.6) * Math.PI / 2) * (x < 1400 ? 1 : 0), eyes: 'dot' } };
        return { x: 1400, y: HILL(1400) + 10, h: 150, pose: t < 4.2 ? { armR: 75, armL: 20, eyes: 'wide' } : cheer(t) }; } },

    // 4 · el retrato: orgullo, medalla y destellos
    { type: 'story', dur: 6.6, trans: { type: 'drop', dur: 0.7 }, say: 'Estoy muy orgullosa de la mujer en que te has convertido.',
      render(K, s, h) { const sk = skin(K), t = s.t, box = { x: 1130, y: 120, w: 620, h: 700 };
        blot(K, 'r', box.x - 20, box.y - 20, box.w + 40, box.h + 40, '#F6E3C8', 41); K.S.portrait(K, { x: box.x + 30, y: box.y + 40, w: box.w - 60, h: box.h - 40 }, h.A(0.2, 0.9), s); if (h.A(0.1, 0.4) > 0) panelBorder(K, box.x, box.y, box.w, box.h, sk); h.cue('enter', 0.2);
        TW(K, 'Estoy muy *orgullosa* de la mujer en que te has convertido', { x: 110, y: 110, w: 900, h: 480 }, (t - 0.6) / 2.0, { align: 'left', max: 104 }, 'pen'); h.cue('title', 0.6);
        medal(K, box.x + box.w - 30, box.y + 40, 70, (t - 3.0) / 0.6, sk); h.cue('impact', 3.1);
        [[1150, 140, 0], [1720, 520, 0.4], [1180, 640, 0.8], [1640, 170, 1.2], [1100, 400, 1.6]].forEach(([x, y, d], i) => sparkle(K, x, y, 34, ((t - 3.3 - d) % 2.2) / 1.0)); },
      actor(t) { return { x: 560, y: FLOOR, h: 160, pose: t > 3.1 ? { ...clap(t), look: [1, -0.4] } : { armL: 15, armR: 40, look: [1, -0.4] } }; } },

    // 5 · el corazón enorme que late
    { type: 'story', dur: 5.8, trans: { type: 'whip', dur: 0.6 }, say: 'Tienes un corazón enorme.',
      render(K, s, h) { const t = s.t, g = L.E.back(L.clamp((t - 0.4) / 1.4)), beat = 1 + 0.05 * Math.max(0, Math.sin(t * 7)) * (t > 1.8 ? 1 : 0);
        TW(K, 'Tienes un corazón *enorme*', { x: 260, y: 40, w: 1400, h: 190 }, (t - 0.2) / 1.2, {}, 'brush'); h.cue('title', 0.2);
        heart(K, 960, 620, 330 * g * beat, ROSE, { seed: 51 }); h.cue('whoosh', 0.4);
        if (t > 2) floatHearts(K, 2, t, 960, 470, 12, { spread: 900, rise: 170, seed: 17, size: 26 }); },
      actor(t) { if (t < 2.2) return { x: 1480, y: FLOOR, h: 150, pose: { armL: 40, armR: 40, eyes: 'wide', look: [-1, -0.6] } };
        const q = L.clamp((t - 2.2) / 0.6); return { x: L.lerp(1480, 1180, L.E.inOut(q)), y: FLOOR - Math.sin(q * Math.PI) * 140, h: 150, pose: q < 1 ? { armL: 70, armR: 70, eyes: 'happy' } : { armL: 60, armR: 60, eyes: 'happy', rot: -0.15, flip: true } }; } },

    // 6 · la lluvia y el paraguas-corazón
    { type: 'story', dur: 6.6, trans: { type: 'pan', dur: 0.8 }, say: 'Siempre estás ahí cuando más te necesito.',
      render(K, s, h) { const sk = skin(K), t = s.t, ctx = K.ctx, U = { x: 700, y: FLOOR - 330 }, sun = L.clamp((t - 3.8) / 1.0), rainA = 1 - sun;
        if (sun > 0) { ctx.save(); ctx.globalAlpha = sun; blot(K, 'c', 180, 60, 300, 300, GOLD, 61); ctx.restore(); }
        ctx.save(); ctx.globalAlpha = 0.35 + 0.65 * rainA; blot(K, 'c', 330, 90, 620, 220, '#8C98A6', 62); blot(K, 'c', 480, 40, 380, 200, '#9BA6B2', 63); ctx.restore();
        if (rainA > 0) { const r = L.rng(8); ctx.save(); ctx.strokeStyle = SKY; ctx.lineWidth = 4 * K.u; ctx.lineCap = 'round'; ctx.globalAlpha = rainA;
          for (let k = 0; k < 70; k++) { const x = 330 + r() * 640, sp = 900 + r() * 300, y = 280 + ((t * sp + r() * 800) % 640); const under = t > 1.9 && Math.abs(x - U.x) < 190 && y > U.y - 20; if (!under) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 26); ctx.stroke(); } } ctx.restore(); }
        umbrella(K, U.x, U.y, 190, (t - 1.8) / 0.5, sk); if (t > 1.8) h.cue('pop', 1.8);
        heart(K, U.x, U.y - 100, 34, '#FFFFFF', { p: (t - 2.2) / 0.3, seed: 64 });
        TW(K, 'Siempre estás ahí cuando más te *necesito*', { x: 1050, y: 200, w: 780, h: 460 }, (t - 0.3) / 1.8, { align: 'left', max: 110 }, 'pencil'); h.cue('title', 0.3); },
      actor(t) { return { x: 620, y: FLOOR, h: 150, pose: t < 1.9 ? { armL: 5, armR: 5, sy: 0.92, eyes: 'closed' } : t < 3.8 ? { armL: 20, armR: 72, eyes: 'happy', look: [0, -1] } : { ...clap(t) } }; } },

    // 7 · eres hermosa: florecen flores alrededor de su retrato
    { type: 'story', dur: 5.8, trans: { type: 'flip', dur: 0.7 }, say: 'Eres hermosa, por dentro y por fuera.',
      render(K, s, h) { const sk = skin(K), t = s.t; blot(K, 'c', 180, 140, 760, 760, '#F7DDE1', 71);
        K.S.portrait(K, { x: 250, y: 180, w: 620, h: 720 }, h.A(0.1, 0.9), s); h.cue('enter', 0.1);
        [[210, 760, ROSE, 0.6], [880, 300, LILA, 0.9], [230, 330, GOLD, 1.2], [900, 720, ROSE2, 1.5], [560, 150, '#F0A3B5', 1.8], [120, 540, LILA, 2.1], [980, 520, ROSE, 2.4]].forEach(([x, y, c, d], i) => { flower(K, x, y, 44, (t - d) / 0.5, c, sk, i); if (t > d) h.cue('pop', d); });
        TW(K, 'Eres *hermosa*', { x: 1080, y: 260, w: 760, h: 260 }, (t - 0.5) / 1.1, {}, 'brush'); h.cue('title', 0.5);
        HAND(K, 'por dentro y por fuera', { x: 1080, y: 540, w: 760, h: 100 }, h.A(2.0, 0.8)); },
      actor(t) { const q = L.clamp((t - 2.6) / 1.2), x = L.lerp(1780, 1250, L.E.inOut(q)); return { x, y: FLOOR, h: 140, pose: q > 0 && q < 1 ? { ...walk(t), flip: true } : { armL: 55, armR: 20, eyes: q >= 1 ? 'happy' : 'dot', flip: true },
        after: (K, m) => flower(K, m.handR[0] - 10, m.handR[1] - 40, 30, 1, ROSE, skin(K), 3) }; } },

    // 8 · mejor amiga y confidente: dos blobs en una banca
    { type: 'story', dur: 6.4, trans: { type: 'pan', dur: 0.8 }, say: 'Mi mejor amiga, mi confidente.',
      render(K, s, h) { const sk = skin(K), t = s.t; blot(K, 'r', 380, FLOOR - 40, 1160, 160, '#D8E3CF', 81); bench(K, 620, FLOOR - 120, 680, sk);
        h.mascot(1110, FLOOR - 120, 150, { color: LILA, armL: t > 2.6 ? 45 : 15, armR: 10, eyes: t > 3.2 ? 'happy' : 'dot', look: [-1, 0], hop: t > 3.4 ? Math.abs(Math.sin(t * 7)) * 8 : 0 }, 'happy', h.A(0.2, 0.5, L.E.back));
        if (t > 1.4) { const q = L.E.back(L.clamp((t - 1.4) / 0.4)); K.ctx.save(); K.ctx.translate(1000, 480); K.ctx.scale(q, q); K.ctx.translate(-1000, -480); bubble(K, 800, 330, 420, 230, 1060, 620, sk);
          heart(K, 930, 445, 58, ROSE, { p: (t - 1.8) / 0.3, seed: 82 }); lock(K, 1090, 460, 90, sk); K.ctx.restore(); h.cue('pop', 1.4); }
        HAND(K, 'tu secreto está a salvo conmigo', { x: 720, y: 180, w: 580, h: 80 }, h.A(2.6, 0.7));
        TW(K, 'Mi mejor amiga, mi *confidente*', { x: 260, y: 30, w: 1400, h: 160 }, (t - 0.2) / 1.4, { max: 110 }, 'pen'); h.cue('title', 0.2); },
      actor(t) { return { x: 820, y: FLOOR - 120, h: 150, pose: { armL: 10, armR: t > 2.6 ? 45 : 15, eyes: t > 3.2 ? 'happy' : 'dot', look: [1, 0], hop: t > 3.4 ? Math.abs(Math.sin(t * 7 + 1)) * 8 : 0 } }; } },

    // 9 · y por mil razones más
    { type: 'story', dur: 6.8, trans: { type: 'zoom', x: 0.49, y: 0.4, zoom: 5, dur: 0.8 }, say: 'Y por mil razones más.',
      render(K, s, h) { const t = s.t;
        TW(K, 'Y por *mil* razones más…', { x: 260, y: 40, w: 1400, h: 180 }, (t - 0.2) / 1.2, {}, 'marker'); h.cue('title', 0.2);
        [['tu risa', 330, 360, ROSE], ['tus abrazos', 960, 330, ROSE2], ['tu mirada', 1590, 360, '#C9506B'], ['tus locuras', 380, 700, ROSE2], ['tu paciencia', 1540, 700, ROSE], ['cómo me cuidas', 960, 570, '#C9506B']].forEach(([w, x, y, c], i) => { const d = 1.1 + i * 0.55, p = (t - d) / 0.45;
          heart(K, x, y + Math.sin(t * 2 + i) * 6, 150, c, { p, seed: 90 + i, rot: (i % 2 ? 1 : -1) * 0.06 }); if (p > 0.3) { h.cue('pop', d);
            para(K, w, { x: x - 118, y: y - 62 + Math.sin(t * 2 + i) * 6, w: 236, h: 92 }, L.clamp((p - 0.3) * 2), { font: sz => K.S.type.hand(sz), color: '#FFFFFF', max: 62, align: 'center', stroke: 'rgba(110,25,45,.8)', strokeW: 7 }); } }); },
      actor(t) { return { x: 960, y: FLOOR, h: 150, pose: t < 1.2 ? { armL: 30, armR: 30, eyes: 'wide' } : { ...cheer(t), look: [Math.sin(t * 1.5), -0.6] } }; } },

    // 10 · final: te amo, Sofía
    { type: 'story', dur: 7.4, trans: { type: 'iris', x: 0.5, y: 0.75, dur: 0.9 }, say: 'Te amo, Sofía. Hoy, mañana y siempre.',
      render(K, s, h) { const t = s.t; blot(K, 'c', 460, 90, 1000, 560, BLUSH, 101);
        TW(K, 'Te amo,\n*Sofía*', { x: 360, y: 90, w: 1200, h: 460 }, (t - 0.3) / 1.8, { max: 200 }, 'brush'); h.cue('title', 0.3);
        HAND(K, 'hoy, mañana y siempre', { x: 460, y: 560, w: 1000, h: 100 }, h.A(2.4, 0.9), { max: 72 });
        confetti(K, t, 2.2, [ROSE, GOLD, ROSE2, LILA], { n: 70 }); if (t > 2.2) h.cue('impact', 2.2);
        floatHearts(K, 2.4, t, 960, 1000, 18, { spread: 1700, rise: 900, seed: 111, size: 34 }); floatHearts(K, 4.2, t, 960, 1000, 14, { spread: 1700, rise: 900, seed: 112, size: 30 }); },
      actor(t) { const up = t > 1.8; return { x: 960, y: FLOOR + 20, h: 150, pose: up ? { armL: 72, armR: 72, eyes: 'happy', hop: Math.abs(Math.sin(t * 5)) * 14 } : { armL: 20, armR: 20, eyes: 'dot' },
        after: (K, m) => heart(K, m.top[0], m.top[1] - 70, 64, ROSE, { p: (t - 1.8) / 0.4, seed: 120, rot: Math.sin(t * 4) * 0.08 }) }; } },
  ],
};
