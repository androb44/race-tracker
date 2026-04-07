import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ───
const WEEKS_HM = [
  {
    num: 1, dates: "6–12. apr", phase: "Baza", color: "#3B82F6", total: "~22 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "8 km", paceTarget: "6:40–7:00/km", distNum: 8, paceNum: 6.83,
        segments: [{ name: "Cijeli trening", detail: "8 km ravnim terenom, tempo konverzacijski. Fokus na opuštene ramene i kratke korake." }] },
      { type: "interval", label: "Intervali — 6×800m", dist: "~10 km", paceTarget: "5:30/km (intervali)", distNum: 10, paceNum: 5.5,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano (7:00/km) + 4 stride-a po 80m sa 30s odmora." },
          { name: "⚡ Glavni dio", detail: "6×800m @ 5:30/km. Odmor: 2 min lagani kas. Drži konzistentan tempo." },
          { name: "🧊 Cooldown", detail: "2 km lagano (7:00+/km) + 5 min stretching." }
        ] },
      { type: "long", label: "Long Run", dist: "14 km", paceTarget: "6:30/km", distNum: 14, paceNum: 6.5,
        segments: [
          { name: "Km 1–3", detail: "Zagrijavanje, 6:45/km." },
          { name: "Km 4–11", detail: "Kruzni tempo 6:30/km." },
          { name: "Km 12–14", detail: "Zadrži tempo, ne ubrzavaj." },
          { name: "📍 Teren", detail: "Ruta sa blagim usponima — navikavanje na profil utrke." }
        ] },
    ],
  },
  {
    num: 2, dates: "13–19. apr", phase: "Baza", color: "#3B82F6", total: "~24 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "8 km", paceTarget: "6:40/km", distNum: 8, paceNum: 6.67,
        segments: [{ name: "Cijeli trening", detail: "Opušteno trčanje, fokus na pravilno disanje." }] },
      { type: "interval", label: "Intervali — 5×1000m", dist: "~10 km", paceTarget: "5:25/km (intervali)", distNum: 10, paceNum: 5.42,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano (7:00/km) + dinamički stretching + 4 stride-a." },
          { name: "⚡ Glavni dio", detail: "5×1000m @ 5:25/km. Odmor: 2:30 min." },
          { name: "🧊 Cooldown", detail: "2 km lagano + stretching 5–10 min." }
        ] },
      { type: "long", label: "Long Run", dist: "15 km", paceTarget: "6:20/km", distNum: 15, paceNum: 6.33,
        segments: [
          { name: "Km 1–3", detail: "Lagano zagrijavanje 6:40/km." },
          { name: "Km 4–12", detail: "Tempo 6:20/km. Traži rutu sa usponima." },
          { name: "Km 13–15", detail: "Održi tempo. Vježbaj hidraciju u pokretu." },
          { name: "📍 Teren", detail: "2-3 uspona od 20-30m elevation." }
        ] },
    ],
  },
  {
    num: 3, dates: "20–26. apr", phase: "Gradnja", color: "#F59E0B", total: "~27 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "9 km", paceTarget: "6:30/km", distNum: 9, paceNum: 6.5,
        segments: [{ name: "Cijeli trening", detail: "Malo duži easy run. Lagani tempo, slušaj tijelo." }] },
      { type: "interval", label: "Hill Repeats — 6×400m", dist: "~9 km", paceTarget: "Napor 80%", distNum: 9, paceNum: 5.5,
        segments: [
          { name: "🔥 Warmup", detail: "2.5 km lagano + dinamički stretching + 3 stride-a." },
          { name: "⚡ Glavni dio", detail: "6×400m UZBRDO (nagib 4-6%). Odmor: kas nazad (~2:30)." },
          { name: "🧊 Cooldown", detail: "2 km lagano + 10 min stretching." },
          { name: "📍 Zašto", detail: "HM trasa ima 131m elevation. Hill repeats grade snagu." }
        ] },
      { type: "long", label: "Long Run", dist: "17 km", paceTarget: "6:20/km", distNum: 17, paceNum: 6.33,
        segments: [
          { name: "Km 1–3", detail: "Zagrijavanje 6:40/km." },
          { name: "Km 4–8", detail: "6:20/km, talasast teren." },
          { name: "Km 9–14", detail: "Održavaj 6:20/km. Prilagodi tempo terenu." },
          { name: "Km 15–17", detail: "Zadrži ritam. Zadnji km može 6:10." },
          { name: "📍 Teren", detail: "Ruta sa 60-80m uspona. Testiraj gel na km 10." }
        ] },
    ],
  },
  {
    num: 4, dates: "27. apr – 3. maj", phase: "Gradnja", color: "#F59E0B", total: "~28 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "9 km", paceTarget: "6:30/km", distNum: 9, paceNum: 6.5,
        segments: [{ name: "Cijeli trening", detail: "Oporavak od prethodne sedmice. Lagano i kontrolisano." }] },
      { type: "interval", label: "Tempo — 4×1600m", dist: "~11 km", paceTarget: "5:25/km", distNum: 11, paceNum: 5.42,
        segments: [
          { name: "🔥 Warmup", detail: "2.5 km lagano + dinamički stretching + 4 stride-a." },
          { name: "⚡ Glavni dio", detail: "4×1600m @ 5:25/km. Odmor: 3 min." },
          { name: "🧊 Cooldown", detail: "2 km lagano + stretching 10 min." }
        ] },
      { type: "long", label: "Long Run", dist: "18 km", paceTarget: "6:15/km", distNum: 18, paceNum: 6.25,
        segments: [
          { name: "Km 1–3", detail: "Zagrijavanje 6:30/km." },
          { name: "Km 4–10", detail: "Race pace 6:15/km." },
          { name: "Km 11–15", detail: "Drži 6:15/km." },
          { name: "Km 16–18", detail: "Negativni split ako možeš: 6:10/km." },
          { name: "📍 Teren", detail: "Ruta sa ~80-100m elevation gain." }
        ] },
    ],
  },
  {
    num: 5, dates: "4–10. maj", phase: "Peak", color: "#EF4444", total: "~30 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "8 km", paceTarget: "6:30/km", distNum: 8, paceNum: 6.5,
        segments: [{ name: "Cijeli trening", detail: "Dan između teških treninga. Lagano, ravni teren." }] },
      { type: "interval", label: "Race Pace — 3×2000m", dist: "~11 km", paceTarget: "5:25/km", distNum: 11, paceNum: 5.42,
        segments: [
          { name: "🔥 Warmup", detail: "2.5 km lagano + dinamički stretching + 4 stride-a." },
          { name: "⚡ Glavni dio", detail: "3×2000m @ 5:25/km. Odmor: 3 min. Najteži trening!" },
          { name: "🧊 Cooldown", detail: "2.5 km lagano + 10–15 min stretching." }
        ] },
      { type: "long", label: "Long Run — PROBA 🔥", dist: "20 km", paceTarget: "6:15/km", distNum: 20, paceNum: 6.25,
        segments: [
          { name: "Km 1–3", detail: "Zagrijavanje 6:25/km." },
          { name: "Km 4–10", detail: "Race pace 6:15/km. Simuliraj uslove utrke." },
          { name: "Km 11–16", detail: "Održavaj 6:15/km. Gel na km 10–11." },
          { name: "Km 17–20", detail: "Test! Zadrži tempo ili ubrzaj." },
          { name: "📍 Teren", detail: "OBAVEZNO 100-130m elevation gain!" }
        ] },
    ],
  },
  {
    num: 6, dates: "11–17. maj", phase: "Taper", color: "#8B5CF6", total: "~22 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "7 km", paceTarget: "6:30/km", distNum: 7, paceNum: 6.5,
        segments: [{ name: "Cijeli trening", detail: "Smanjena kilometraža. Tijelo se puni energijom." }] },
      { type: "interval", label: "Održavanje — 5×600m", dist: "~8 km", paceTarget: "5:20/km", distNum: 8, paceNum: 5.33,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano + dinamički stretching + 3 stride-a." },
          { name: "⚡ Glavni dio", detail: "5×600m @ 5:20/km. Odmor: 2 min. Svježe na kraju!" },
          { name: "🧊 Cooldown", detail: "2 km lagano + lagani stretching." }
        ] },
      { type: "long", label: "Long Run", dist: "14 km", paceTarget: "6:20/km", distNum: 14, paceNum: 6.33,
        segments: [
          { name: "Km 1–3", detail: "Lagano zagrijavanje 6:35/km." },
          { name: "Km 4–11", detail: "6:20/km, ujednačeno." },
          { name: "Km 12–14", detail: "Zadrži tempo. Zadnji duži trening." }
        ] },
    ],
  },
  {
    num: 7, dates: "18–23. maj", phase: "Race Week", color: "#10B981", total: "~10 km + UTRKA",
    workouts: [
      { type: "easy", label: "Easy Run (pon)", dist: "5 km", paceTarget: "6:40/km", distNum: 5, paceNum: 6.67,
        segments: [{ name: "Cijeli trening", detail: "Razgibavanje. Noge lake, bez stresa." }] },
      { type: "interval", label: "Aktivacija (sri)", dist: "~5 km", paceTarget: "5:15/km (strides)", distNum: 5, paceNum: 5.25,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano." },
          { name: "⚡ Glavni dio", detail: "4×400m @ 5:15/km sa 1:30 odmora." },
          { name: "🧊 Cooldown", detail: "1 km lagano. Odmor do subote!" }
        ] },
      { type: "long", label: "🏁 UTRKA", dist: "21.1 km", paceTarget: "Sub 2:05–2:08", distNum: 21.1, paceNum: 5.95,
        segments: [
          { name: "Km 1–5", detail: "KONTROLA! 6:15–6:20/km." },
          { name: "Km 6–10", detail: "Ritam 6:10–6:15/km." },
          { name: "Km 11–15", detail: "6:10/km. Gel na km 12." },
          { name: "Km 16–18", detail: "⚠️ Najtežih 3 km! Kraći korak na usponima." },
          { name: "Km 19–21.1", detail: "🔥 DAJ SVE! Ubrzaj na 5:50-6:00/km." }
        ] },
    ],
  },
];

const WEEKS_10K = [
  {
    num: 1, dates: "6–12. apr", phase: "Baza", color: "#EC4899", total: "~14 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "4 km", paceTarget: "7:00–7:20/km", distNum: 4, paceNum: 7.17,
        segments: [{ name: "Cijeli trening", detail: "Lagano trčanje. Kombinuj trčanje/hodanje ako treba." }] },
      { type: "interval", label: "Intervali — 6×200m", dist: "~5 km", paceTarget: "6:00/km", distNum: 5, paceNum: 6.0,
        segments: [
          { name: "🔥 Warmup", detail: "1.5 km lagano + 3 min dinamički stretching." },
          { name: "⚡ Glavni dio", detail: "6×200m @ 6:00/km. Odmor: 1:30 hodanje." },
          { name: "🧊 Cooldown", detail: "1.5 km lagano + 5 min stretching." }
        ] },
      { type: "long", label: "Long Run", dist: "5 km", paceTarget: "7:00/km", distNum: 5, paceNum: 7.0,
        segments: [
          { name: "Km 1–2", detail: "Lagani start 7:15/km." },
          { name: "Km 3–5", detail: "Drži 7:00/km ujednačeno." }
        ] },
    ],
  },
  {
    num: 2, dates: "13–19. apr", phase: "Baza", color: "#EC4899", total: "~16 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "4 km", paceTarget: "7:00/km", distNum: 4, paceNum: 7.0,
        segments: [{ name: "Cijeli trening", detail: "Opušteno, fokus na disanje." }] },
      { type: "interval", label: "Intervali — 5×400m", dist: "~6 km", paceTarget: "5:50/km", distNum: 6, paceNum: 5.83,
        segments: [
          { name: "🔥 Warmup", detail: "1.5 km lagano + 2 stride-a po 60m." },
          { name: "⚡ Glavni dio", detail: "5×400m @ 5:50/km. Odmor: 2 min." },
          { name: "🧊 Cooldown", detail: "1.5 km lagano + stretching 5 min." }
        ] },
      { type: "long", label: "Long Run", dist: "6 km", paceTarget: "6:50/km", distNum: 6, paceNum: 6.83,
        segments: [
          { name: "Km 1–2", detail: "Zagrijavanje 7:00/km." },
          { name: "Km 3–6", detail: "Tempo 6:50/km." }
        ] },
    ],
  },
  {
    num: 3, dates: "20–26. apr", phase: "Gradnja", color: "#F59E0B", total: "~18 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "4.5 km", paceTarget: "6:50/km", distNum: 4.5, paceNum: 6.83,
        segments: [{ name: "Cijeli trening", detail: "Malo duži easy run. Slušaj tijelo." }] },
      { type: "interval", label: "Hill Repeats — 5×200m", dist: "~5.5 km", paceTarget: "Napor 75%", distNum: 5.5, paceNum: 5.83,
        segments: [
          { name: "🔥 Warmup", detail: "1.5 km lagano + dinamički stretching." },
          { name: "⚡ Glavni dio", detail: "5×200m UZBRDO (3-5%). Odmor: kas nazad." },
          { name: "🧊 Cooldown", detail: "1.5 km lagano + stretching listova." }
        ] },
      { type: "long", label: "Long Run", dist: "7 km", paceTarget: "6:50/km", distNum: 7, paceNum: 6.83,
        segments: [
          { name: "Km 1–2", detail: "Lagano zagrijavanje 7:00/km." },
          { name: "Km 3–7", detail: "6:50/km sa 1 blagim usponom." }
        ] },
    ],
  },
  {
    num: 4, dates: "27. apr – 3. maj", phase: "Gradnja", color: "#F59E0B", total: "~20 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "5 km", paceTarget: "6:50/km", distNum: 5, paceNum: 6.83,
        segments: [{ name: "Cijeli trening", detail: "Lagano i kontrolisano. Ravni teren." }] },
      { type: "interval", label: "Intervali — 4×800m", dist: "~7 km", paceTarget: "5:45/km", distNum: 7, paceNum: 5.75,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano + 3 stride-a." },
          { name: "⚡ Glavni dio", detail: "4×800m @ 5:45/km. Odmor: 2:30." },
          { name: "🧊 Cooldown", detail: "1.5 km lagano + stretching 10 min." }
        ] },
      { type: "long", label: "Long Run", dist: "8 km", paceTarget: "6:40/km", distNum: 8, paceNum: 6.67,
        segments: [
          { name: "Km 1–2", detail: "Zagrijavanje 6:55/km." },
          { name: "Km 3–6", detail: "6:40/km. Negativni split." },
          { name: "Km 7–8", detail: "Ako OK: 6:30/km." }
        ] },
    ],
  },
  {
    num: 5, dates: "4–10. maj", phase: "Peak", color: "#EF4444", total: "~21 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "5 km", paceTarget: "6:50/km", distNum: 5, paceNum: 6.83,
        segments: [{ name: "Cijeli trening", detail: "Održavanje. Lagano, bez pritiska." }] },
      { type: "interval", label: "Race Pace — 3×1000m", dist: "~8 km", paceTarget: "5:45/km", distNum: 8, paceNum: 5.75,
        segments: [
          { name: "🔥 Warmup", detail: "2 km lagano + 3 stride-a." },
          { name: "⚡ Glavni dio", detail: "3×1000m @ 5:45/km. Odmor: 3 min." },
          { name: "🧊 Cooldown", detail: "2 km lagano + temeljni stretching." }
        ] },
      { type: "long", label: "Long Run — PROBA 🔥", dist: "9 km", paceTarget: "6:40/km", distNum: 9, paceNum: 6.67,
        segments: [
          { name: "Km 1–2", detail: "Zagrijavanje 7:00/km." },
          { name: "Km 3–7", detail: "6:40/km — simulacija utrke." },
          { name: "Km 8–9", detail: "Ubrzaj na 6:20–6:30/km." }
        ] },
    ],
  },
  {
    num: 6, dates: "11–17. maj", phase: "Taper", color: "#8B5CF6", total: "~15 km",
    workouts: [
      { type: "easy", label: "Easy Run", dist: "4 km", paceTarget: "6:50/km", distNum: 4, paceNum: 6.83,
        segments: [{ name: "Cijeli trening", detail: "Smanjena kilometraža. Tijelo se puni." }] },
      { type: "interval", label: "Održavanje — 4×400m", dist: "~5.5 km", paceTarget: "5:40/km", distNum: 5.5, paceNum: 5.67,
        segments: [
          { name: "🔥 Warmup", detail: "1.5 km lagano + 2 stride-a." },
          { name: "⚡ Glavni dio", detail: "4×400m @ 5:40/km. Odmor: 2 min." },
          { name: "🧊 Cooldown", detail: "1.5 km lagano + stretching." }
        ] },
      { type: "long", label: "Long Run", dist: "6 km", paceTarget: "6:40/km", distNum: 6, paceNum: 6.67,
        segments: [
          { name: "Km 1–6", detail: "Lagano i ujednačeno. Zadnji duži trening." }
        ] },
    ],
  },
  {
    num: 7, dates: "18–23. maj", phase: "Race Week", color: "#10B981", total: "~6 km + UTRKA",
    workouts: [
      { type: "easy", label: "Easy Run (pon)", dist: "3 km", paceTarget: "7:00/km", distNum: 3, paceNum: 7.0,
        segments: [{ name: "Cijeli trening", detail: "Razgibavanje. Noge lake i svježe." }] },
      { type: "interval", label: "Aktivacija (sri)", dist: "~3.5 km", paceTarget: "5:30/km (strides)", distNum: 3.5, paceNum: 5.5,
        segments: [
          { name: "🔥 Warmup", detail: "1.5 km lagano." },
          { name: "⚡ Glavni dio", detail: "4×200m @ 5:30/km sa 1:30 odmora." },
          { name: "🧊 Cooldown", detail: "1 km lagano." }
        ] },
      { type: "long", label: "🏁 UTRKA — 10K", dist: "10 km", paceTarget: "Sub 1:02–1:04", distNum: 10, paceNum: 6.2,
        segments: [
          { name: "Km 1–3", detail: "KONTROLA! 6:20–6:30/km." },
          { name: "Km 4–7", detail: "Ritam 6:10–6:15/km." },
          { name: "Km 8–10", detail: "🔥 FINISH! Daj sve od sebe." }
        ] },
    ],
  },
];

const typeIcons = { easy: "🟢", interval: "🔴", long: "🔵" };
const phaseEmoji = { Baza: "🧱", Gradnja: "📈", Peak: "🔥", Taper: "🧘", "Race Week": "🏁" };

// ─── REMOTE STORAGE (KV via Cloudflare Functions) with localStorage fallback ───
const API_BASE = "/api/logs";

async function remoteFetch(key) {
  try {
    const res = await fetch(`${API_BASE}?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.value || {};
  } catch {
    // Fallback to localStorage
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
  }
}

async function remoteSave(key, value) {
  // Always save locally as cache
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  // Then sync to remote
  try {
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function remoteDelete(key) {
  try { localStorage.removeItem(key); } catch {}
  try { await fetch(`${API_BASE}?key=${encodeURIComponent(key)}`, { method: "DELETE" }); } catch {}
}

// ─── ANALYSIS ENGINE ───
function parsePace(str) {
  if (!str) return null;
  const parts = str.split(":");
  if (parts.length === 2) return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  return parseFloat(str) || null;
}

function fmtPace(dec) {
  if (!dec) return "-";
  const m = Math.floor(dec);
  const s = Math.round((dec - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function analyzeWorkout(planned, actual) {
  const notes = [];
  let score = 0;

  if (!actual.distance || !actual.pace) return { notes: ["Nedovoljno podataka za analizu."], score: 0, badge: "⚪" };

  const actPace = parsePace(actual.pace);
  const actDist = parseFloat(actual.distance);
  const planPace = planned.paceNum;
  const planDist = planned.distNum;

  const distDiff = ((actDist - planDist) / planDist) * 100;
  if (distDiff > 10) { notes.push(`📏 Istrčao ${actDist} km umjesto ${planDist} — više nego planirano (+${distDiff.toFixed(0)}%).`); score += 0.5; }
  else if (distDiff < -15) { notes.push(`📏 Istrčao ${actDist} km umjesto ${planDist} — znatno manje (-${Math.abs(distDiff).toFixed(0)}%).`); score -= 1; }
  else if (distDiff < -5) { notes.push(`📏 Istrčao ${actDist} km — malo manje od plana.`); score -= 0.3; }
  else { notes.push(`📏 Distanca ✓ — u okviru plana.`); score += 0.5; }

  if (actPace && planPace) {
    const paceDiffSec = (actPace - planPace) * 60;
    if (planned.type === "easy") {
      if (paceDiffSec < -15) { notes.push(`⚡ Easy run tempo ${fmtPace(actPace)}/km — prebrzo! Easy run mora biti LAG.`); score -= 0.5; }
      else if (paceDiffSec > 20) { notes.push(`🐌 Tempo ${fmtPace(actPace)}/km — sporije od plana, ali OK za easy run.`); score += 0.3; }
      else { notes.push(`👍 Tempo ${fmtPace(actPace)}/km — idealan za easy run.`); score += 0.5; }
    } else {
      if (paceDiffSec < -15) { notes.push(`🚀 Tempo ${fmtPace(actPace)}/km — brže od plana za ${Math.abs(paceDiffSec).toFixed(0)}s! Odlično.`); score += 1; }
      else if (paceDiffSec > 15) { notes.push(`🐌 Tempo ${fmtPace(actPace)}/km — sporije od cilja (${fmtPace(planPace)}) za ${paceDiffSec.toFixed(0)}s.`); score -= 0.5; }
      else { notes.push(`👍 Tempo ${fmtPace(actPace)}/km — u okviru cilja (${fmtPace(planPace)}).`); score += 0.5; }
    }
  }

  if (actual.hr) {
    const hr = parseInt(actual.hr);
    if (planned.type === "easy" && hr > 155) { notes.push(`💓 HR ${hr} bpm — previsok za easy run. Cilj: ispod 150.`); score -= 0.3; }
    else if (planned.type === "interval" && hr > 175) { notes.push(`💓 HR ${hr} bpm — visok. Pazi na oporavak.`); }
    else if (planned.type === "easy" && hr <= 145) { notes.push(`💓 HR ${hr} bpm — odličan za easy run!`); score += 0.3; }
    else { notes.push(`💓 HR ${hr} bpm — u normalnom opsegu.`); }
  }

  if (actual.elevation) {
    const elev = parseInt(actual.elevation);
    if (planned.type === "long" && elev > 50) { notes.push(`⛰️ ${elev}m elevation — dobra priprema za trasu!`); score += 0.3; }
    else if (elev > 0) { notes.push(`⛰️ ${elev}m elevation gain.`); }
  }

  const badge = score >= 1.2 ? "🏆" : score >= 0.5 ? "✅" : score >= -0.3 ? "⚡" : "⚠️";
  return { notes, score, badge };
}

function generateRecommendations(allLogs, weeks) {
  const recs = [];
  const logged = Object.entries(allLogs).filter(([_, v]) => v.distance && v.pace);
  if (logged.length < 2) return ["Unesi podatke sa bar 2 treninga za personalizovane preporuke."];

  let totalScore = 0, fastCount = 0, slowCount = 0, highHrEasy = 0;

  logged.forEach(([key, actual]) => {
    const [wn, wi] = key.split("-").map(Number);
    const week = weeks.find(w => w.num === wn);
    if (!week) return;
    const planned = week.workouts[wi];
    if (!planned) return;
    const { score } = analyzeWorkout(planned, actual);
    totalScore += score;
    const actPace = parsePace(actual.pace);
    if (actPace && planned.paceNum) {
      if ((planned.paceNum - actPace) * 60 > 15) fastCount++;
      if ((actPace - planned.paceNum) * 60 > 15) slowCount++;
    }
    if (planned.type === "easy" && actual.hr && parseInt(actual.hr) > 155) highHrEasy++;
  });

  const avg = totalScore / logged.length;
  if (avg > 1.0) recs.push("🚀 NAPREDAK IZNAD OČEKIVANJA! Razmisli o bržim ciljevima — intervale podesi 5-10s/km brže.");
  else if (avg > 0.5) recs.push("✅ Odličan napredak — plan radi. Nastavi istim tempom.");
  else if (avg > -0.3) recs.push("⚡ Solidno ali ima prostora. Fokus na konzistentnost tempa.");
  else recs.push("⚠️ Treninzi ispod plana. Smanji tempo za 10-15s/km u narednoj sedmici.");

  if (fastCount >= 2) recs.push("📈 Više puta brži od plana! Naredne intervale podići za 5s/km.");
  if (slowCount >= 2) recs.push("📉 Nekoliko sporijih treninga. Provjeri san, ishranu, hidraciju.");
  if (highHrEasy > 0) recs.push("💓 HR na easy runovima previsok. Uspori — easy run je temelj!");

  return recs;
}

// ─── UI COMPONENTS ───
function InputField({ label, value, onChange, placeholder, suffix }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: "#64748B", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "7px 8px", borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
            color: "#E2E8F0", fontSize: 13, outline: "none", fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        {suffix && <span style={{ fontSize: 10, color: "#64748B", whiteSpace: "nowrap" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function LogForm({ log, onUpdate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 0" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <InputField label="Distanca" value={log.distance || ""} onChange={(v) => onUpdate({ ...log, distance: v })} placeholder="8.2" suffix="km" />
        <InputField label="Vrijeme" value={log.time || ""} onChange={(v) => onUpdate({ ...log, time: v })} placeholder="54:30" suffix="" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <InputField label="Avg Pace" value={log.pace || ""} onChange={(v) => onUpdate({ ...log, pace: v })} placeholder="6:38" suffix="/km" />
        <InputField label="Avg HR" value={log.hr || ""} onChange={(v) => onUpdate({ ...log, hr: v })} placeholder="148" suffix="bpm" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <InputField label="Elevation" value={log.elevation || ""} onChange={(v) => onUpdate({ ...log, elevation: v })} placeholder="65" suffix="m" />
        <InputField label="Napomena" value={log.note || ""} onChange={(v) => onUpdate({ ...log, note: v })} placeholder="Osjećaj..." suffix="" />
      </div>
    </div>
  );
}

// ─── PLAN VIEW ───
function PlanView({ weeks, accent, gradFrom, gradTo, title, subtitle, info, fontD, storageKey }) {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [showLog, setShowLog] = useState(null);
  const [logs, setLogs] = useState({});
  const [showRecs, setShowRecs] = useState(false);
  const [syncStatus, setSyncStatus] = useState("loading"); // loading | synced | saving | offline
  const [confirmReset, setConfirmReset] = useState(false);
  const saveTimer = useRef(null);

  // Load from remote on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await remoteFetch(storageKey);
      if (!cancelled) {
        setLogs(data);
        setSyncStatus("synced");
      }
    })();
    return () => { cancelled = true; };
  }, [storageKey]);

  // Debounced save — 800ms after last edit
  const debouncedSave = useCallback((newLogs) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const ok = await remoteSave(storageKey, newLogs);
      setSyncStatus(ok ? "synced" : "offline");
    }, 800);
  }, [storageKey]);

  const updateLog = (key, data) => {
    setLogs(prev => {
      const next = { ...prev, [key]: data };
      debouncedSave(next);
      return next;
    });
  };

  // Pull fresh data when tab becomes visible (e.g. switching back from another app)
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        remoteFetch(storageKey).then(data => {
          setLogs(data);
          setSyncStatus("synced");
        });
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [storageKey]);

  const totalWorkouts = weeks.reduce((a, w) => a + w.workouts.length, 0);
  const doneCount = Object.values(logs).filter(l => l.distance && l.pace).length;
  const progress = Math.round((doneCount / totalWorkouts) * 100);
  const recs = generateRecommendations(logs, weeks);

  const syncIcon = { loading: "⏳", synced: "☁️", saving: "💾", offline: "📴" }[syncStatus];
  const syncText = { loading: "Učitavam...", synced: "Sinhronizovano", saving: "Čuvam...", offline: "Offline režim" }[syncStatus];

  if (syncStatus === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#64748B", fontSize: 13 }}>
        <div style={{ marginBottom: 8, fontSize: 20 }}>⏳</div>
        Učitavam podatke...
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{
          fontFamily: fontD, fontSize: 24, fontWeight: 800, margin: 0,
          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{title}</h2>
        <div style={{ fontSize: 13, color: accent, marginTop: 4 }}>{subtitle}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 11, color: "#64748B" }}>{info}</span>
          <span style={{
            fontSize: 9, padding: "2px 6px", borderRadius: 4,
            background: syncStatus === "synced" ? "rgba(52,211,153,0.1)" : syncStatus === "saving" ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)",
            color: syncStatus === "synced" ? "#34D399" : syncStatus === "saving" ? "#FBBF24" : "#F87171",
            fontWeight: 600,
          }}>{syncIcon} {syncText}</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px",
        marginBottom: 14, border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 7 }}>
          <span style={{ color: "#94A3B8" }}>Logovano</span>
          <span style={{ color: accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{totalWorkouts}</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`, borderRadius: 3, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Recommendations */}
      {doneCount >= 2 && (
        <div onClick={() => setShowRecs(!showRecs)}
          style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.06)", cursor: "pointer" }}>
          <div style={{ padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24" }}>🤖 AI Preporuke za plan</span>
            <span style={{ fontSize: 14, color: "#64748B", transform: showRecs ? "rotate(180deg)" : "", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
          </div>
          {showRecs && (
            <div style={{ padding: "0 14px 12px" }}>
              {recs.map((r, i) => (
                <div key={i} style={{ padding: "8px 10px", marginTop: 5, borderRadius: 8, background: "rgba(255,255,255,0.03)", fontSize: 12, color: "#E2E8F0", lineHeight: 1.5, borderLeft: "3px solid #FBBF24" }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weeks */}
      {weeks.map((week) => {
        const isOpen = expandedWeek === week.num;
        const weekLogged = week.workouts.every((_, i) => logs[`${week.num}-${i}`]?.distance && logs[`${week.num}-${i}`]?.pace);
        return (
          <div key={week.num} style={{
            marginBottom: 8, borderRadius: 12, overflow: "hidden",
            border: `1px solid ${isOpen ? week.color + "44" : "rgba(255,255,255,0.06)"}`,
            background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          }}>
            <div onClick={() => { setExpandedWeek(isOpen ? null : week.num); setExpandedWorkout(null); setShowLog(null); }}
              style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 7, background: `${week.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: week.color, fontFamily: fontD, flexShrink: 0,
                }}>{weekLogged ? "✓" : week.num}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Sedmica {week.num}</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>{week.dates} · {week.total}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: `${week.color}18`, color: week.color, fontWeight: 600 }}>
                  {phaseEmoji[week.phase]} {week.phase}
                </span>
                <span style={{ fontSize: 14, color: "#64748B", transform: isOpen ? "rotate(180deg)" : "", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
              </div>
            </div>

            {isOpen && (
              <div style={{ padding: "2px 12px 12px" }}>
                {week.workouts.map((w, i) => {
                  const wKey = `${week.num}-${i}`;
                  const isWOpen = expandedWorkout === wKey;
                  const isLogging = showLog === wKey;
                  const log = logs[wKey] || {};
                  const hasLog = log.distance && log.pace;
                  const analysis = hasLog ? analyzeWorkout(w, log) : null;

                  return (
                    <div key={i} style={{
                      marginTop: 5, borderRadius: 10, overflow: "hidden",
                      background: hasLog ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${hasLog ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
                    }}>
                      <div onClick={() => { setExpandedWorkout(isWOpen ? null : wKey); if (isWOpen) setShowLog(null); }}
                        style={{ padding: "11px 12px", cursor: "pointer", userSelect: "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ fontSize: 13 }}>{hasLog ? analysis.badge : typeIcons[w.type]}</span>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{w.label}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: week.color, fontWeight: 700 }}>{w.dist}</span>
                            <span style={{ fontSize: 12, color: "#64748B", transform: isWOpen ? "rotate(180deg)" : "", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>Tempo: {w.paceTarget}</div>
                        {hasLog && (
                          <div style={{ display: "flex", gap: 10, marginTop: 5, fontSize: 10, color: "#34D399", fontFamily: "'JetBrains Mono', monospace", flexWrap: "wrap" }}>
                            <span>{log.distance} km</span>
                            <span>{log.time || "-"}</span>
                            <span>{log.pace}/km</span>
                            {log.hr && <span>{log.hr} bpm</span>}
                            {log.elevation && <span>⛰️{log.elevation}m</span>}
                          </div>
                        )}
                      </div>

                      {isWOpen && (
                        <div style={{ padding: "0 12px 12px" }}>
                          {w.segments.map((seg, si) => (
                            <div key={si} style={{
                              padding: "7px 10px", marginTop: 4, borderRadius: 7, background: "rgba(255,255,255,0.03)",
                              borderLeft: `3px solid ${seg.name.includes("📍") || seg.name.includes("Zašto") ? "#F59E0B" : seg.name.includes("🔥") ? "#EF4444" : seg.name.includes("⚡") ? "#3B82F6" : seg.name.includes("🧊") ? "#06B6D4" : week.color}`,
                            }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#CBD5E1", marginBottom: 2 }}>{seg.name}</div>
                              <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.4 }}>{seg.detail}</div>
                            </div>
                          ))}

                          {hasLog && analysis && (
                            <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA", marginBottom: 6 }}>📊 Analiza treninga</div>
                              {analysis.notes.map((n, ni) => (
                                <div key={ni} style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.5, marginTop: 2 }}>{n}</div>
                              ))}
                            </div>
                          )}

                          <button onClick={(e) => { e.stopPropagation(); setShowLog(isLogging ? null : wKey); }}
                            style={{
                              marginTop: 8, width: "100%", padding: "9px", borderRadius: 8, border: "none",
                              background: hasLog ? "rgba(59,130,246,0.12)" : `${week.color}20`,
                              color: hasLog ? "#60A5FA" : week.color, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            }}>
                            {isLogging ? "▲ Zatvori" : hasLog ? "✏️ Izmijeni podatke" : "📝 Unesi podatke sa treninga"}
                          </button>

                          {isLogging && <LogForm log={log} onUpdate={(data) => updateLog(wKey, data)} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Reset */}
      {doneCount > 0 && (
        <div style={{ marginTop: 14 }}>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)}
              style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.06)", color: "#F87171", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              🗑️ Obriši sve unesene podatke
            </button>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={async () => { setLogs({}); setConfirmReset(false); await remoteDelete(storageKey); }}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.2)", color: "#FCA5A5", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                Da, obriši sve
              </button>
              <button onClick={() => setConfirmReset(false)}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                Otkaži
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [tab, setTab] = useState("hm");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0B0F1A 0%, #131B2E 40%, #0B0F1A 100%)",
      color: "#E2E8F0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "20px 14px 40px",
      maxWidth: 540, margin: "0 auto",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#475569", textTransform: "uppercase", marginBottom: 5, fontFamily: "'JetBrains Mono', monospace" }}>
          Race Day · 23. maj 2026
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, margin: 0, color: "#F8FAFC" }}>
          Herceg Novi Race Plans
        </h1>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 16, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3 }}>
        {[
          { id: "hm", label: "🏃‍♂️ Polumaraton", color: "#60A5FA" },
          { id: "10k", label: "🏃‍♀️ 10K", color: "#F472B6" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
              background: tab === t.id ? `${t.color}22` : "transparent",
              color: tab === t.id ? t.color : "#64748B",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Syne', sans-serif", transition: "all 0.2s",
            }}>{t.label}</button>
        ))}
      </div>

      <div style={{
        padding: "9px 13px", marginBottom: 14, borderRadius: 10, fontSize: 11, lineHeight: 1.5,
        background: tab === "hm" ? "rgba(59,130,246,0.06)" : "rgba(236,72,153,0.06)",
        border: `1px solid ${tab === "hm" ? "rgba(59,130,246,0.12)" : "rgba(236,72,153,0.12)"}`,
        color: "#94A3B8",
      }}>
        {tab === "hm"
          ? <>⛰️ <strong style={{ color: "#60A5FA" }}>Trasa:</strong> Herceg Novi obala · 21.1 km · 131m elev · Talasast profil</>
          : <>⛰️ <strong style={{ color: "#F472B6" }}>Trasa:</strong> Igalo · 10.2 km · 59m elev · Pretežno ravan</>
        }
      </div>

      {tab === "hm" ? (
        <PlanView key="hm" weeks={WEEKS_HM} accent="#60A5FA" gradFrom="#60A5FA" gradTo="#818CF8" title="Polumaraton" subtitle="Cilj: sub 2:05–2:08" info="Trenutno: 2:12 → 7 sedmica" fontD="'JetBrains Mono', monospace" storageKey="race-tracker-hm" />
      ) : (
        <PlanView key="10k" weeks={WEEKS_10K} accent="#F472B6" gradFrom="#F472B6" gradTo="#C084FC" title="10K Utrka" subtitle="Cilj: sub 1:02–1:04" info="Trenutno: 1:06 → 7 sedmica" fontD="'Syne', sans-serif" storageKey="race-tracker-10k" />
      )}

      <div style={{ textAlign: "center", marginTop: 22, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "#475569", lineHeight: 1.5 }}>
        Podaci se sinhronizuju između uređaja ☁️<br />
        📝 Unesi podatke → 📊 Analiza → 🤖 AI preporuke
      </div>
    </div>
  );
}
