(() => {
"use strict";
const Q = s => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const csv = v => Array.isArray(v) ? v : String(v || "").split(",").map(s => s.trim()).filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
let ST = loadStory(), S = load(), busy = false, mute = localStorage.getItem("ub_mute") === "1", AC, idle, kbT;

function fresh() { return { scene: ST.start, flags: {}, solved: {}, seen: {}, hints: {}, started: false, visited: {} }; }
function load() { try { const s = JSON.parse(localStorage.getItem("ub_save")); if (s && ST.scenes[s.scene]) return s; } catch (e) {} return fresh(); }
const save = () => { try { localStorage.setItem("ub_save", JSON.stringify(S)); } catch (e) {} };
const ok = l => csv(l).every(f => f[0] === "!" ? !S.flags[f.slice(1)] : S.flags[f]);
const grant = l => csv(l).forEach(f => S.flags[f] = 1);
const T = t => String(t || "").replace(/\{name\}/g, ST.meta.friendName || "friend").replace(/\{from\}/g, ST.meta.from || "");
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 7;
const rng = n => () => (n = n * 16807 % 2147483647) / 2147483647;

/* ---------- sound ---------- */
function chime(n = 1) {
  if (mute) return;
  try { ac(); [659, 784, 988].slice(0, n + 1).forEach((f, i) => {
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * .09;
    o.frequency.value = f; o.type = "sine"; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.08, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .55); }); } catch (e) {}
}

const ac = () => { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); return AC; };
const CH = { garden: [196, 246.9, 293.7], library: [220, 277.2, 329.6], pond: [174.6, 220, 261.6], woods: [164.8, 196, 246.9], clouds: [261.6, 329.6, 392], observatory: [146.8, 220, 293.7], meadow: [261.6, 329.6, 440], final: [196, 293.7, 392] };
let amb = null, sparkT = 0;
function stopAmb() {
  if (sparkT) { clearInterval(sparkT); sparkT = 0; }
  if (amb && AC) { const a = amb; amb = null; try { a.g.gain.setTargetAtTime(0, AC.currentTime, .5); setTimeout(() => a.o.forEach(o => { try { o.stop(); } catch (e) {} }), 3000); } catch (e) {} }
}
function sparkle(fr) { try { const c = ac(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.type = "sine"; o.frequency.value = fr; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.025, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + 1.4); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 1.5); } catch (e) {} }
function ambient(kind) {
  if (mute || !S.started) return stopAmb();
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  if (amb && amb.kind === kind) return; stopAmb();
  try {
    const c = ac(), g = c.createGain(), f = CH[kind] || CH.garden, o = []; g.gain.value = 0; g.connect(c.destination); g.gain.setTargetAtTime(.05, c.currentTime, 1);
    f.forEach((fr, i) => { const x = c.createOscillator(), xg = c.createGain(); x.type = i ? "sine" : "triangle"; x.frequency.value = fr / 2; x.detune.value = (i - 1) * 6; xg.gain.value = .6 / f.length; x.connect(xg); xg.connect(g); x.start(); o.push(x); });
    const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = .12; lg.gain.value = .02; l.connect(lg); lg.connect(g.gain); l.start(); o.push(l);
    amb = { kind, g, o };
    sparkT = setInterval(() => { if (!mute && !document.hidden) sparkle(f[(Math.random() * f.length) | 0] * (Math.random() < .5 ? 2 : 4)); }, 3500 + Math.random() * 2500);
  } catch (e) {}
}

/* ---------- SVG art ---------- */
const C = (x, y, r, f, a = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${a}/>`;
const E = (x, y, rx, ry, f, a = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${a}/>`;
const flower = (x, y, col, s = 1) => `<g class="sw" style="animation-delay:${(x % 7) / 3}s"><path d="M${x} ${y} Q${x + 8 * s} ${y + 30 * s} ${x} ${y + 60 * s}" stroke="#6f9a78" stroke-width="3" fill="none"/>${[0, 72, 144, 216, 288].map(a => E(x, y - 9 * s, 6 * s, 11 * s, col, `transform="rotate(${a} ${x} ${y})" opacity=".92"`)).join("")}${C(x, y, 5 * s, "#ffe6a8")}</g>`;
const panda = (x, y, s = 1, c = "") => `<g transform="translate(${x} ${y}) scale(${s})"><g class="${c}">${C(-16, -22, 8, "#3b2a40")}${C(16, -22, 8, "#3b2a40")}${C(0, 0, 24, "#fffaf5")}${E(-9, -2, 6, 7.5, "#3b2a40", "transform='rotate(-20 -9 -2)'")}${E(9, -2, 6, 7.5, "#3b2a40", "transform='rotate(20 9 -2)'")}<g class="bl">${C(-9, -3, 2.2, "#fff")}${C(9, -3, 2.2, "#fff")}</g>${E(0, 6, 3, 2, "#3b2a40")}<path d="M-4 11q4 4 8 0" stroke="#3b2a40" fill="none" stroke-width="1.5"/>${E(-14, 26, 9, 6, "#3b2a40")}${E(14, 26, 9, 6, "#3b2a40")}</g></g>`;
const catd = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="tl" d="M20 14Q44 12 38-14" stroke="#f4b8c8" stroke-width="7" fill="none" stroke-linecap="round"/>${E(0, 12, 26, 16, "#f9cfdc")}<path d="M-22-14l4-22 16 12zM22-14l-4-22-16 12z" fill="#f4b8c8"/>${C(0, -8, 22, "#f9cfdc")}<g class="bl"><path d="M-12-8q4 4 8 0M4-8q4 4 8 0" stroke="#5a3550" stroke-width="2" fill="none"/></g>${C(0, -1, 2.5, "#e88fb0")}</g>`;
const fish = (x, y, c) => `<g transform="translate(${x} ${y})"><g class="fs">${E(0, 0, 22, 12, c)}<path d="M18 0l18-12v24z" fill="${c}"/>${C(-10, -3, 2, "#5a3550")}</g></g>`;
const bfly = (x, y, c) => `<g transform="translate(${x} ${y})"><g class="ff" style="animation-delay:${x % 5}s"><g class="bf">${E(-9, -4, 9, 13, c, "transform='rotate(-25 -9 -4)'")}${E(9, -4, 9, 13, c, "transform='rotate(25 9 -4)'")}</g></g></g>`;
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="drift">${C(0, 0, 30, "#fff7fb")}${C(34, -12, 38, "#fff7fb")}${C(70, 2, 28, "#fff7fb")}${E(36, 14, 62, 16, "#fff7fb")}</g></g>`;
const hill = (r, y, a, c) => { let d = `M-1000 2000 L-1000 ${y}`; for (let x = -1000; x < 2000; x += 250) d += ` Q ${x + 125} ${y + (r() - .5) * a * 2} ${x + 250} ${y + (r() - .5) * a}`; return `<path d="${d} L2000 2000Z" fill="${c}"/>`; };
const PROPS = {
  garden: r => { let s = ""; for (let i = 0; i < 10; i++) s += flower(60 + i * 95 + r() * 30, 470 + r() * 60, ["#ff9ec4", "#c9a7ff", "#ffd0a8", "#ffb3d1"][i % 4], .9 + r() * .5);
    for (let i = 0; i < 3; i++) { const x = 160 + i * 300 + r() * 50; s += E(x, 548, 45, 22, "#8aa59a") + E(x - 8, 536, 30, 9, "#a8c9a2"); }
    for (let i = 0; i < 14; i++) s += C(r() * 1000, 200 + r() * 330, 3, "#ffe6a8", `class="ff" style="animation-delay:${r() * 8}s"`); return s; },
  library: r => { let s = ""; [[100, 210, 420], [480, 330, 440], [230, 450, 520]].forEach(([x, y, w], i) => { s += `<g class="bob" style="animation-delay:${i}s"><rect x="${x}" y="${y}" width="${w}" height="12" rx="4" fill="#9a6b7e"/>`; let bx = x + 10; while (bx < x + w - 30) { const bw = 14 + r() * 14, bh = 40 + r() * 35; s += `<rect x="${bx}" y="${y - bh}" width="${bw}" height="${bh}" rx="2" fill="${["#e88fb0", "#b79be8", "#f4c68f", "#8fb6e8", "#f2a7a7"][(r() * 5) | 0]}"/>`; bx += bw + 3; } s += "</g>"; });
    for (let i = 0; i < 5; i++) s += `<rect class="pg" x="${100 + i * 190}" y="${120 + r() * 300}" width="26" height="34" rx="3" fill="#fff6e8" style="animation-delay:${i * .7}s"/>`; return s + catd(840, 310, .9); },
  pond: r => { let s = E(500, 500, 520, 90, "#8fb0e6") + E(500, 500, 520, 90, "#fff", 'opacity=".12"'); for (let i = 0; i < 3; i++) s += `<ellipse class="rp" cx="${200 + i * 300}" cy="${500 + r() * 30}" rx="30" ry="8" fill="none" stroke="#fff" stroke-width="2" style="animation-delay:${i * 1.3}s"/>`;
    for (let i = 0; i < 6; i++) s += E(130 + i * 150, 470 + r() * 50, 28, 9, "#7fbf9a"); for (let i = 0; i < 8; i++) { const x = i < 4 ? 20 + i * 22 : 900 + (i - 4) * 22; s += `<path class="sw" d="M${x} 560Q${x + 6} 480 ${x - 4} 420" stroke="#5f8f7a" stroke-width="4" fill="none"/>`; }
    return s + fish(280, 540, "#ffb3c9") + fish(640, 520, "#ffd0a8"); },
  woods: r => { let s = ""; for (let i = 0; i < 7; i++) { const x = 70 + i * 150 + r() * 40, h = 200 + r() * 120; s += `<rect x="${x}" y="${540 - h}" width="26" height="${h}" rx="8" fill="#5b3a63"/>` + C(x + 13, 540 - h, 54 + r() * 20, "#6e4a78") + C(x - 20, 560 - h, 36, "#7d5688"); }
    for (let i = 0; i < 4; i++) s += E(100 + i * 260, 560, 20, 8, "#8e5a8a"); for (let i = 0; i < 10; i++) s += C(r() * 1000, 120 + r() * 400, 3, "#ffe6a8", `class="ff" style="animation-delay:${r() * 8}s"`);
    return s + panda(80, 560, .8, "peek"); },
  clouds: r => { let s = ""; for (let i = 0; i < 6; i++) s += cloud(r() * 900, 80 + r() * 380, .8 + r() * .7);
    return s + E(300, 330, 150, 26, "#bfe3b0") + `<path d="M150 335Q300 560 450 335Z" fill="#b08a86"/>` + E(620, 470, 170, 28, "#bfe3b0") + `<path d="M470 475Q620 640 770 475Z" fill="#b08a86"/>` + bfly(830, 220, "#ff9ec4"); },
  observatory: r => { let s = "", pts = []; for (let i = 0; i < 8; i++) { const p = [100 + i * 115 + r() * 40, 90 + r() * 250]; pts.push(p); s += C(p[0], p[1], 5, "#ffe6a8", `class="tw" style="animation-delay:${r() * 3}s"`); }
    s += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="#ffe6a8" stroke-width="1.5" opacity=".5"/>`;
    return s + `<path d="M250 540Q500 220 750 540Z" fill="#c9b6ee"/><rect x="230" y="540" width="540" height="40" rx="8" fill="#9a6b7e"/><path d="M470 330Q500 300 530 330L520 540H480Z" fill="#14143f" opacity=".55"/>` + catd(860, 520, .9); },
  meadow: r => { let s = ""; for (let i = 0; i < 40; i++) { const x = r() * 1000, h = 25 + r() * 40; s += `<path class="sw" d="M${x} 600Q${x + 4} ${600 - h / 2} ${x - 3} ${600 - h}" stroke="#7fbf9a" stroke-width="3" fill="none"/>`; }
    for (let i = 0; i < 9; i++) s += flower(40 + i * 115 + r() * 30, 480 + r() * 60, ["#ff9ec4", "#c9a7ff", "#ffd0a8", "#fff1a8"][i % 4], 1 + r() * .4);
    for (let i = 0; i < 4; i++) s += bfly(120 + i * 230, 200 + r() * 150, ["#ff9ec4", "#c9a7ff", "#ffd0a8", "#9fd0f0"][i]);
    return s + panda(900, 540, .9); },
  final: r => `<rect x="330" y="470" width="340" height="16" rx="6" fill="#b08a86"/><rect x="360" y="486" width="14" height="70" fill="#9a6b7e"/><rect x="626" y="486" width="14" height="70" fill="#9a6b7e"/>` + flower(120, 470, "#ff9ec4", 1.2) + flower(880, 480, "#c9a7ff", 1.2) + C(500, 340, 90, "#ffe6a8", 'opacity=".18" class="gl"') + panda(250, 540, 1) + catd(760, 545, 1)
};
function art(w, id) {
  const r = rng(hash(id)), [c1, c2] = w.sky; let s = `<defs><linearGradient id="sk" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="520"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="-2000" y="-2000" width="5000" height="4000" fill="url(#sk)"/>`;
  for (let i = 0; i < 60; i++) s += C(-200 + r() * 1400, r() * 330, .8 + r() * 1.6, "#fff6e8", `class="tw" style="animation-delay:${r() * 3}s"`);
  s += C(820, 175, 44, "#fff3d6") + C(836, 165, 40, c1, 'opacity=".25"');
  s += hill(r, 400, 60, "#ffffff22") + hill(r, 470, 50, "#ffffff22") + hill(r, 540, 30, "#00000022");
  return s + (PROPS[w.kind] || PROPS.garden)(r);
}
const G = {
  flower: c => flower(0, 10, c || "#ff9ec4", 1.7),
  stone: () => E(0, 20, 48, 26, "#8aa59a") + E(-6, 8, 32, 10, "#a8c9a2") + '<path d="M-20 22h40M-14 30h28" stroke="#f3e3a4" stroke-width="2" opacity=".7"/>',
  book: c => `<rect x="-24" y="-8" width="48" height="36" rx="4" fill="${c || "#e88fb0"}"/><rect x="-24" y="-8" width="9" height="36" rx="3" fill="#00000022"/><path d="M-8 -8v20l5-4 5 4v-20" fill="#d9b46a"/>`,
  bottle: () => '<rect x="-14" y="-14" width="28" height="46" rx="12" fill="#bfe0f5" opacity=".85"/><rect x="-6" y="-26" width="12" height="14" rx="2" fill="#d9b46a"/><rect x="-6" y="2" width="12" height="16" rx="2" fill="#fff6e8"/>',
  mushroom: c => `<rect x="-8" y="6" width="16" height="26" rx="6" fill="#fff6e8"/><path d="M-34 8Q0 -46 34 8Z" fill="${c || "#f08fb0"}"/>${C(-10, -6, 4, "#fff")}${C(8, -14, 3, "#fff")}${C(14, -2, 3, "#fff")}`,
  lantern: () => '<path d="M0 -50v14" stroke="#9a6b7e" stroke-width="2"/><rect x="-14" y="-36" width="28" height="42" rx="8" fill="#ffe6a8" class="gl"/><rect x="-16" y="-38" width="32" height="6" rx="3" fill="#9a6b7e"/><rect x="-16" y="2" width="32" height="6" rx="3" fill="#9a6b7e"/>',
  envelope: () => `<rect x="-30" y="-20" width="60" height="42" rx="4" fill="#fff6e8" stroke="#d9b46a" stroke-width="2"/><path d="M-30 -18L0 6l30-24" fill="none" stroke="#d9b46a" stroke-width="2"/>${C(0, 6, 6, "#f08fb0")}`,
  star: () => '<path d="M0-30l8 20 22 2-17 14 6 21-19-12-19 12 6-21-17-14 22-2z" fill="#ffe6a8" stroke="#d9b46a"/>',
  lily: () => E(0, 10, 50, 14, "#7fbf9a") + C(0, 2, 10, "#ffc4da") + C(0, -2, 5, "#ffe6a8"),
  telescope: () => '<g transform="rotate(-30)"><rect x="-10" y="-60" width="22" height="70" rx="6" fill="#d9b46a"/><rect x="-14" y="-66" width="30" height="12" rx="4" fill="#9a6b7e"/></g><path d="M-8 20L-24 50M8 20L24 50M0 20V50" stroke="#9a6b7e" stroke-width="4"/>',
  mailbox: () => '<rect x="-26" y="-20" width="52" height="38" rx="14" fill="#f4a3c0"/><rect x="-3" y="18" width="6" height="34" fill="#9a6b7e"/><rect x="14" y="-34" width="4" height="22" fill="#d9b46a"/><rect x="14" y="-34" width="14" height="9" fill="#d9b46a"/>',
  butterfly: c => `<g class="bf">${E(-14, -6, 16, 22, c || "#c9a7ff", "transform='rotate(-25 -14 -6)'")}${E(14, -6, 16, 22, c || "#c9a7ff", "transform='rotate(25 14 -6)'")}</g><rect x="-2" y="-18" width="4" height="34" rx="2" fill="#5a3550"/>`,
  feather: () => '<path d="M-10 30Q-20-30 14-34Q18 4-10 30Z" fill="#f8d7e6" stroke="#d9b46a"/><path d="M-10 30L8-26" stroke="#d9b46a"/>',
  page: () => '<rect x="-22" y="-28" width="44" height="56" rx="3" fill="#fff6e8" stroke="#d9b46a" transform="rotate(8)"/><path d="M-12-14h24M-12-6h24M-12 2h16" stroke="#e88fb0" stroke-width="2" transform="rotate(8)"/>',
  panda: () => panda(0, 0, 1.4), cat: () => catd(0, 0, 1.4)
};

/* ---------- rendering ---------- */
const vb = () => innerWidth < innerHeight ? "130 90 740 510" : "0 90 1000 510";
addEventListener("resize", () => { const v = Q("#art svg"); if (v) v.setAttribute("viewBox", vb()); });
const curScene = () => ST.scenes[S.scene];
const curWorld = () => ST.worlds[curScene().world] || Object.values(ST.worlds)[0];
const say = (t, big) => { if (big) return card(`<p></p><div class="row"><button class="pri x">Close</button></div>`, c => { c.querySelector("p").textContent = T(t); c.querySelector(".x").onclick = closeCard; }); const n = Q("#nar"); n.textContent = T(t); n.style.animation = "none"; void n.offsetWidth; n.style.animation = "fadeup .5s both"; };

function render() {
  const sc = curScene(), w = curWorld(); Q("#wn").textContent = w.name;
  let objs = ""; (sc.objects || []).forEach((o, i) => { if (!ok(o.showIf)) return; const used = S.seen[S.scene + o.id];
    objs += `<g class="obj ${used ? "used" : ""}" data-i="${i}" tabindex="0" role="button" aria-label="${(o.label || o.kind).replace(/"/g, "")}" transform="translate(${o.x} ${o.y})"><circle r="50" fill="transparent"/><g class="g">${(G[o.kind] || G.star)(o.color)}</g><circle class="halo" r="40"/><circle class="cue" cy="-52" r="3.5"/></g>`; });
  Q("#art").innerHTML = `<svg viewBox="${vb()}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${w.name}">${art(w, S.scene)}${objs}</svg>`;
  Q("#art").querySelectorAll(".obj").forEach(g => { const go = () => poke(+g.dataset.i, g); g.onclick = go; g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }; });
  const v = (sc.variants || []).find(v => ok(v.if));
  Q("#pt").textContent = T(sc.title); Q("#px").textContent = T(v ? v.text : sc.text); Q("#nar").textContent = ""; Q("#px").style.animation = "none"; void Q("#px").offsetWidth; Q("#px").style.animation = "";
  const ch = Q("#ch"); ch.innerHTML = "";
  (sc.choices || []).forEach(c => { if (!ok(c.showIf)) return; const open = ok(c.need), b = el("button", "choice" + (open ? "" : " lock")); b.textContent = T(c.text);
    b.onclick = () => { if (!open) { say(c.locked || "Not yet. Something here still needs discovering."); kit("hop"); return; } const r = b.getBoundingClientRect(); grant(c.set); goTo(c.go, { x: r.left + r.width / 2, y: r.top, tr: c.tr }); }; ch.append(b); });
  Q("#kb").classList.remove("on"); Q("#kit").dataset.w = w.kind; wake(); Q("#panel").scrollTop = 0; ambient(w.kind); enter(); walkIn();
}

function poke(i, g) {
  const o = curScene().objects[i]; if (!o || busy) return; chime(0);
  if (!ok(o.need)) { say(o.lockedSay || "Nothing happens. Maybe something else needs to happen first."); return; }
  if (o.puzzle && !S.solved[o.puzzle]) { openPuzzle(o.puzzle); return; }
  S.seen[S.scene + o.id] = 1; g.classList.add("used"); grant(o.get); save();
  const alt = (o.alt || []).find(a => ok(a.if)); say(alt ? alt.say : o.say || "", o.big); if (o.get && csv(o.get).length) { chime(1); kit("happy"); react("clue", .6); }
  if (o.go) goTo(o.go, {});
}

/* ---------- modal & puzzles ---------- */
function card(html, after) {
  const m = Q("#modal"); m.innerHTML = `<div class="card" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false;
  const c = m.firstChild; if (after) after(c); m.onclick = e => { if (e.target === m) closeCard(); }; return c;
}
const closeCard = () => { Q("#modal").hidden = true; Q("#modal").innerHTML = ""; };
addEventListener("keydown", e => { if (e.key === "Escape") closeCard(); });

function openPuzzle(id) {
  const p = ST.puzzles[id]; if (!p) return;
  if (!ok(p.needs)) { say(p.locked || "Something is still missing. Explore a little more."); return; }
  const c = card(`<h2></h2><p></p><div class="body"></div><p class="msg" aria-live="polite"></p><div class="row"><button class="x">Close</button></div>`);
  c.querySelector("h2").textContent = T(ST.scenes[S.scene].title); c.querySelector("p").textContent = T(p.prompt); c.querySelector(".x").onclick = closeCard;
  const body = c.querySelector(".body"), msg = c.querySelector(".msg"), ans = csv(p.answers).length ? p.answers : [];
  const fail = () => { msg.textContent = T(p.wrong || "Not quite. Try again.") + (Math.random() < .4 ? "  Kitten says: " + pick(LN.wrong) : ""); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); kit("hop"); };
  const win = () => { S.solved[id] = 1; grant(p.reward); save(); closeCard(); chime(2); kit("happy"); say(p.win || "Solved."); react("solve", 1); render2(); if (p.go) setTimeout(() => goTo(p.go, {}), 900); };
  const render2 = () => { Q("#nar").textContent = Q("#nar").textContent; renderChoices(); };
  if (p.type === "choice") { csv(p.options).forEach(o => { const b = el("button", "pick"); b.textContent = o; b.style.margin = "4px"; b.onclick = () => (norm(o) === norm(ans[0]) ? win() : fail()); body.append(b); }); }
  else if (p.type === "sequence") { const picks = []; const out = el("p"); out.textContent = "Order so far: (none)"; body.append(out);
    csv(p.options).forEach(o => { const b = el("button", "pick"); b.textContent = o; b.style.margin = "4px"; b.onclick = () => { picks.push(o); b.disabled = true; out.textContent = "Order so far: " + picks.join(", "); if (picks.length === ans.length) { if (picks.every((x, i) => norm(x) === norm(ans[i]))) win(); else { fail(); picks.length = 0; body.querySelectorAll("button").forEach(x => x.disabled = false); out.textContent = "Order so far: (none)"; } } }; body.append(b); }); }
  else { const i = el("input"); i.setAttribute("aria-label", "Your answer"); i.autocomplete = "off"; const b = el("button", "pri", "Try it"); const go = () => (ans.some(a => norm(a) === norm(i.value)) ? win() : fail()); b.onclick = go; i.onkeydown = e => { if (e.key === "Enter") go(); }; body.append(i, b); setTimeout(() => i.focus(), 50); }
}
function renderChoices() { const keep = Q("#nar").textContent; const sc = curScene(); Q("#ch").querySelectorAll(".choice").forEach(() => {}); const t = Q("#nar").textContent; render(); Q("#nar").textContent = keep || t; }

/* ---------- kitten ---------- */
function kit(st) { const k = Q("#kit"); k.classList.remove("hop", "happy"); void k.offsetWidth; k.classList.add(st); setTimeout(() => k.classList.remove(st), 900); wake(); }
function wake() { const k = Q("#kit"); k.classList.remove("sleep"); clearTimeout(idle); idle = setTimeout(() => k.classList.add("sleep"), curScene() && curWorld().kind === "library" ? 12000 : 22000); }
function bubble(t, ms = 9000) { const b = Q("#kb"); b.textContent = T(t); b.classList.add("on"); clearTimeout(kbT); kbT = setTimeout(() => b.classList.remove("on"), ms); }

let kc = 0, kt = 0;
const pick = a => a[(Math.random() * a.length) | 0];
const LN = {
  clue: ["Mrrp! A clue. I knew it. I definitely knew it.", "Ooh. Write that down. I would, but paws.", "Shiny fact acquired.", "Good poke. Ten out of ten."],
  solve: ["Mrrp! Obviously. I had it the whole time.", "*loud purring* Correct. I am very proud of us.", "Nice. I will take half the credit. The nap half."],
  wrong: ["Bold choice.", "Wrong, but done with confidence.", "Try again, human. I will be here, looking superior.", "Not my fault. I was not even looking."],
  enter: { garden: "Night air. Smells like flowers and mild suspicion.", library: "Shh. Everything here is judging us quietly.", pond: "Do not let me near the water. I mean it.", woods: "I did not agree to this many shadows.", clouds: "A cat in the clouds. This is all I ever wanted.", observatory: "So many tiny lights. Nobody is chasing them. Suspicious.", meadow: "Butterflies. Do not look at me. I am not looking at them.", final: "...Mrrp. We made it." }
};
function react(kind, p) { if (Math.random() > p) return; kit("happy"); bubble(pick(LN[kind]), 6000); }
function enter() { if (!S.started) return; S.visited = S.visited || {}; if (S.visited[S.scene]) return; S.visited[S.scene] = 1; save(); const k = curWorld().kind; setTimeout(() => bubble("Mrrp. " + (LN.enter[k] || "New place. Sniffing it."), 6500), 1500); }
function walkIn() { if (reduce) return; const k = Q("#kit"); k.classList.remove("walk"); void k.offsetWidth; k.classList.add("walk"); setTimeout(() => k.classList.remove("walk"), 1300); }
(function fidget() { setTimeout(() => { const k = Q("#kit"); if (!document.hidden && !reduce) { if (!k.classList.contains("sleep")) { const m = pick(["stretch", "twitch", "look"]); k.classList.add(m); setTimeout(() => k.classList.remove(m), 1300); } else if (Math.random() < .4) bubble("zzz... (mrrp?)", 3000); } fidget(); }, 7000 + Math.random() * 7000); })();
function hint() {
  const now = Date.now(); kc = now - kt < 1500 ? kc + 1 : 1; kt = now; if (kc >= 6) { kc = 0; kit("happy"); bubble("I am a professional. Please stop. ...Slightly to the left.", 5000); return; }
  const sc = curScene(), objs = (sc.objects || []).filter(o => ok(o.showIf)), pool = ST.kitten && (ST.kitten[sc.world] || ST.kitten._) || ["Mrrp."], pre = pool[(Math.random() * pool.length) | 0]; let line;
  const po = objs.find(o => o.puzzle && !S.solved[o.puzzle] && ST.puzzles[o.puzzle]);
  if (po) { const p = ST.puzzles[po.puzzle], miss = csv(p.needs).find(f => !S.flags[f]);
    if (miss) { const o = objs.find(o => csv(o.get).includes(miss)); line = o ? `That ${o.label} has not been properly poked yet. Just saying.` : "Something is missing, and it is not in this room. Maybe one step back."; }
    else { const n = S.hints[po.puzzle] || 0, hs = csv(p.hints); S.hints[po.puzzle] = n + 1; line = hs.length ? hs[Math.min(n, hs.length - 1)] : "I have no hints. Only opinions."; } }
  else { const o = objs.find(o => !S.seen[S.scene + o.id]); line = o ? (sc.kitten || `I keep staring at the ${o.label}. You might too.`) : "Nothing left to poke here. Time to walk on, human."; }
  const open = (sc.choices || []).some(c => ok(c.need)); if (!po && !objs.find(o => !S.seen[S.scene + o.id]) && !open) line = "Hm. Every path is shut. Perhaps something earlier went unread.";
  save(); kit("hop"); bubble(pre + " " + line.replace(/^(Mrrp|Mew|Mrow)[.,!]?\s*/i, ""));
}
addEventListener("pointermove", e => { const k = Q("#kit").getBoundingClientRect(), dx = Math.max(-1, Math.min(1, (e.clientX - k.left - 40) / 300)), dy = Math.max(-1, Math.min(1, (e.clientY - k.top - 40) / 300)); const s = Q("#kit").style; s.setProperty("--px", dx * 2 + "px"); s.setProperty("--py", dy * 2 + "px"); wake(); });

/* ---------- transitions ---------- */
async function goTo(id, o) {
  if (busy) return; if (id === "@restart") { S = fresh(); S.started = true; id = S.scene; }
  if (!ST.scenes[id]) return; busy = true;
  try {
    const type = o.tr || (ST.worlds[ST.scenes[id].world] || {}).tr || "ink"; chime(1); kit("hop");
    const swap = () => { S.scene = id; save(); render(); };
    if (reduce) { swap(); return; }
    Q("#art svg") && Q("#art svg").classList.add("react"); await wait(420);
    await transition(type, o.x, o.y, swap);
  } finally { busy = false; }
}
async function transition(type, x, y, mid) {
  const o = Q("#tr"), W = innerWidth; x = x ?? W / 2; y = y ?? innerHeight / 2; o.innerHTML = ""; let a;
  if (type === "ripple" || type === "ink") { o.style.cssText = `display:block;background:${type === "ink" ? "#4a2c4f" : "radial-gradient(#d6e5ff,#9fb8ea)"}`; a = o.animate([{ clipPath: `circle(0 at ${x}px ${y}px)` }, { clipPath: `circle(150vmax at ${x}px ${y}px)` }], { duration: 760, easing: "ease-in", fill: "forwards" }); }
  else if (type === "page") { o.style.cssText = "display:block;background:linear-gradient(90deg,#f7dfc8,#fff6e8);transform-origin:left"; a = o.animate([{ transform: "perspective(900px) rotateY(90deg)" }, { transform: "perspective(900px) rotateY(0)" }], { duration: 720, easing: "ease-in", fill: "forwards" }); }
  else { const st = type === "stars"; o.style.cssText = `display:block;background:${st ? "#1b1a4a" : "#ffd6e4"}`;
    for (let i = 0; i < 40; i++) { const p = el("i", "pt"); p.style.cssText = `left:-30px;top:${Math.random() * 100}%;background:${st ? "#fff3b8" : "#ff9ec4"};${st ? "border-radius:50%;width:8px;height:8px" : ""}`; o.append(p); p.animate([{ transform: "translateX(0) rotate(0)" }, { transform: `translateX(${W + 80}px) rotate(${Math.random() * 720}deg)` }], { duration: 800 + Math.random() * 600, delay: Math.random() * 250, fill: "forwards" }); }
    a = o.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 760, fill: "forwards" }); }
  await Promise.race([a.finished, wait(1500)]); mid(); await wait(80);
  const b = o.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, fill: "forwards" }); await Promise.race([b.finished, wait(1200)]);
  o.getAnimations().forEach(x => x.cancel()); o.style.cssText = ""; o.innerHTML = "";
}

/* ---------- ui ---------- */
Q("#kit").onclick = hint;
Q("#bj").onclick = () => { const f = Object.keys(ST.clues || {}).filter(k => S.flags[k]); card(`<h2>Journal</h2><div class="j"></div><div class="row"><button class="x">Close</button></div>`, c => { const j = c.querySelector(".j"); if (!f.length) j.textContent = "Nothing written yet. Go poke something."; f.forEach(k => { const d = el("div", "cl"); d.textContent = ST.clues[k]; j.append(d); }); c.querySelector(".x").onclick = closeCard; }); };
const snd = () => Q("#bs").textContent = mute ? "Sound off" : "Sound on";
Q("#bs").onclick = () => { mute = !mute; localStorage.setItem("ub_mute", mute ? "1" : "0"); snd(); chime(1); mute ? stopAmb() : ambient(curWorld().kind); }; snd();
Q("#br").onclick = () => { card(`<h2>Start over?</h2><p>This clears your progress, not your custom story.</p><div class="row"><button class="pri y">Restart</button><button class="x">Keep playing</button></div>`, c => { c.querySelector(".x").onclick = closeCard; c.querySelector(".y").onclick = () => { closeCard(); S = fresh(); S.started = true; save(); render(); }; }); };

function boot() {
  render();
  if (!S.started) card(`<h2></h2><p></p><div class="row"><button class="pri o">Open the book</button></div>`, c => {
    c.querySelector("h2").textContent = T(ST.meta.title); c.querySelector("p").textContent = T("A story for {name}, from {from}. Poke things. Ask the kitten if you get stuck. Nothing here is in a hurry.");
    c.querySelector(".o").onclick = () => { S.started = true; save(); closeCard(); chime(2); ambient(curWorld().kind); enter(); }; });
}
addEventListener("pointerdown", () => { if (!mute && S.started) { ac(); ambient(curWorld().kind); } });
document.addEventListener("visibilitychange", () => { if (AC) document.hidden ? AC.suspend() : (!mute && AC.resume()); });
boot();
})();
