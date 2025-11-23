/* ---------------- progress bar ---------------- */
const progress = document.getElementById("progress");
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.transform = `scaleX(${scrolled})`;
}
document.addEventListener("scroll", updateProgress, { passive:true });
updateProgress();

/* ---------------- scenes reveal + rail ---------------- */
const scenes = [...document.querySelectorAll(".scene.step")];
const dots = [...document.querySelectorAll(".rail .dot")];

function setActiveDot(id){
  dots.forEach(d => d.classList.toggle("active", d.dataset.target === id));
}

const sceneObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("reveal");
      setActiveDot(entry.target.id);
      triggerCounters(entry.target);
      triggerGrowth(entry.target);
    }
  });
}, { threshold: 0.55 });

scenes.forEach(s => sceneObserver.observe(s));

dots.forEach(dot=>{
  dot.addEventListener("click", ()=>{
    document.getElementById(dot.dataset.target)
      .scrollIntoView({ behavior:"smooth", block:"center" });
  });
});

/* ---------------- counters ---------------- */
const eased = t => 1 - Math.pow(1-t, 3);
const counted = new WeakSet();

function triggerCounters(container){
  const nums = container.querySelectorAll(".count");
  nums.forEach(n=>{
    if(counted.has(n)) return;
    counted.add(n);

    const from = Number(n.dataset.from || 0);
    const to   = Number(n.dataset.to   || 0);
    const dur  = 1200 + Math.min(2000, to/80);
    const start = performance.now();

    function step(now){
      const p = Math.min(1, (now - start)/dur);
      const val = Math.round(from + (to-from)*eased(p));
      n.textContent = val.toLocaleString("no-NO");
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// hero counters once
const heroObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      triggerCounters(document);
      heroObs.disconnect();
    }
  });
}, { threshold:0.6 });
heroObs.observe(document.querySelector("#hero"));

/* ---------------- growth bars ---------------- */
const grown = new WeakSet();
function triggerGrowth(container){
  const growths = container.querySelectorAll(".growth");
  growths.forEach(g=>{
    if(grown.has(g)) return;
    grown.add(g);

    const pct = Number(g.dataset.growth || 60);
    const bar = g.querySelector(".bar > span");
    requestAnimationFrame(()=> bar.style.width = pct + "%");
  });
}

/* ---------------- FLY-BY SKINS (rene PNG uten noe som henger etter) ---------------- */
const skinsLayer = document.getElementById("skinsLayer");

const skinDefs = [
  { label: "AK Redline",     size:1.0,  img:"assets/skins/redline.png" },
  { label: "Howl",           size:1.1,  img:"assets/skins/howl.png" },
  { label: "Medusa",         size:2.0,  img:"assets/skins/medusa.png" },
  { label: "Blue Gem",       size:1.15, img:"assets/skins/bluegem.png" },
  { label: "Wild Lotus",     size:1.0,  img:"assets/skins/wildlotus.png" },
  { label: "Crimson Kimono", size:1.05, img:"assets/skins/kimono.png" },
  { label: "Knife",          size:0.95, img:"assets/skins/knife.png" },
  { label: "Case",           size:0.9,  img:"assets/skins/case.png" }
];

const startSpots = [
  {x: 0.08, y: 0.20}, {x: 0.72, y: 0.12},
  {x: 0.15, y: 0.62}, {x: 0.78, y: 0.55},
  {x: 0.35, y: 0.30}, {x: 0.55, y: 0.72},
  {x: 0.22, y: 0.42}, {x: 0.88, y: 0.32}
];

const skins = [];
const rand = (a,b)=>a+Math.random()*(b-a);

function createSkins(){
  const W = innerWidth, H = innerHeight;

  skinDefs.forEach((d,i)=>{
    const el = document.createElement("div");
    el.className = "skin";

    // ✅ KUN IMG. Ingen caption, ingen tekst, ingenting ekstra.
    el.innerHTML = `<img src="${d.img}" alt="${d.label}">`;
    skinsLayer.appendChild(el);

    const w = 190*d.size, h = 120*d.size;
    el.style.width = w+"px";
    el.style.height = h+"px";

    const spot = startSpots[i % startSpots.length];

    skins.push({
      el,
      x: spot.x * (W - w),
      y: spot.y * (H - h),
      vx: rand(0.3, 0.7) * (Math.random() < 0.5 ? 1 : -1),
      vy: rand(-0.05, 0.05),
      r: rand(-8, 8),
      vr: rand(-0.08, 0.08),
      w, h,
      drift: rand(0, 9999)
    });
  });
}
createSkins();

function animateSkins(){
  const W = innerWidth, H = innerHeight;

  skins.forEach((s,i)=>{
    s.x += s.vx;
    s.y += s.vy + Math.sin((performance.now()/1500) + s.drift) * 0.04;
    s.r += s.vr;

    // respawn når de flyr ut
    if(s.x > W + 80) s.x = -s.w - 60;
    if(s.x < -s.w - 80) s.x = W + 60;

    if(s.y > H + 80) s.y = -s.h - 40;
    if(s.y < -s.h - 80) s.y = H + 40;

    s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg)`;
  });

  requestAnimationFrame(animateSkins);
}
animateSkins();

window.addEventListener("resize", ()=>{
  const W = innerWidth, H = innerHeight;
  skins.forEach((s,i)=>{
    const spot = startSpots[i % startSpots.length];
    s.x = spot.x * (W - s.w);
    s.y = spot.y * (H - s.h);
  });
});
/* ===== HEADER INTERAKSJON ===== */

// 1) Rotating / typewriter tekst
const rotatorLines = [
  "2015: bare et spill – ingen plan.",
  "Første arbitrage med AK Redline.",
  "Howl og Medusa ble vendepunktet.",
  "Trading finansierte studietiden.",
  "CS2 gjorde markedet farligere."
];
const rotatingTextEl = document.getElementById("rotatingText");
let rotatorIndex = 0;

function typeLine(line, i=0){
  rotatingTextEl.textContent = line.slice(0, i);
  if(i < line.length){
    setTimeout(()=>typeLine(line, i+1), 24);
  }else{
    setTimeout(()=>eraseLine(line), 1200);
  }
}
function eraseLine(line, i=line.length){
  rotatingTextEl.textContent = line.slice(0, i);
  if(i > 0){
    setTimeout(()=>eraseLine(line, i-1), 14);
  }else{
    rotatorIndex = (rotatorIndex + 1) % rotatorLines.length;
    typeLine(rotatorLines[rotatorIndex]);
  }
}
typeLine(rotatorLines[0]);

// 2) Start-knapp
const startBtn = document.getElementById("startStoryBtn");
startBtn?.addEventListener("click", ()=>{
  document.getElementById("s1")?.scrollIntoView({behavior:"smooth", block:"center"});
});

// 3) Tilt på hero-card
const heroCard = document.getElementById("heroCard");
function tilt(e){
  const rect = heroCard.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = (e.clientX - cx) / rect.width;
  const dy = (e.clientY - cy) / rect.height;
  heroCard.style.transform = `
    rotateX(${(-dy*8).toFixed(2)}deg)
    rotateY(${(dx*10).toFixed(2)}deg)
    translateZ(0)
  `;
  heroCard.style.boxShadow = `0 30px 80px rgba(0,0,0,.55)`;
}
function untilt(){
  heroCard.style.transform = "";
  heroCard.style.boxShadow = "";
}
heroCard?.addEventListener("mousemove", tilt);
heroCard?.addEventListener("mouseleave", untilt);

// 4) “Markedstemning” meter som følger scroll (kun visual, ikke flytting av skins)
const moodBar = document.getElementById("moodBar");
const moodHint = document.getElementById("moodHint");

function updateMood(){
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  const pct = Math.max(0, Math.min(1, scrolled));
  if(moodBar) moodBar.style.width = (pct*100).toFixed(0) + "%";

  if(!moodHint) return;
  if(pct < .15) moodHint.textContent = "Rolig oppstart";
  else if(pct < .35) moodHint.textContent = "Første mønstre";
  else if(pct < .55) moodHint.textContent = "Bygger system";
  else if(pct < .75) moodHint.textContent = "Volatil vekst";
  else moodHint.textContent = "CS2-kaos";
}
document.addEventListener("scroll", updateMood, {passive:true});
updateMood();

// 5) Pause/Resume skins animasjon
const toggleMotionBtn = document.getElementById("toggleMotionBtn");
let skinsPaused = false;

// Du må ha en global flagg i skins-anim din:
window.__SKINS_PAUSED__ = false;

toggleMotionBtn?.addEventListener("click", ()=>{
  skinsPaused = !skinsPaused;
  window.__SKINS_PAUSED__ = skinsPaused;

  toggleMotionBtn.setAttribute("aria-pressed", String(skinsPaused));
  toggleMotionBtn.textContent = skinsPaused ? "Start bakgrunn" : "Pause bakgrunn";
  heroCard?.classList.toggle("is-paused", skinsPaused);
});

/* ===== Chapter 2: reveal steps one-by-one ===== */
const s2 = document.querySelector('#s2 [data-anim="market"]');
if (s2) {
  const steps = [...s2.querySelectorAll(".arb-step")];
  const result = s2.querySelector(".market-result");

  const s2Obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;

      // step reveal i rekkefølge
      steps.forEach((st, i)=>{
        setTimeout(()=> st.classList.add("is-on"), 350 + i*520);
      });

      // result til slutt
      setTimeout(()=> result?.classList.add("is-on"), 350 + steps.length*520);

      s2Obs.disconnect();
    });
  }, { threshold: 0.6 });

  s2Obs.observe(s2);
}

/* ===== Kapittel 2 v2: fortellende marked-scene ===== */
const s2v2 = document.querySelector('#s2 [data-anim="market2"]');

if(s2v2){
  const tradeSkin = document.getElementById("tradeSkin2");
  const richCard  = document.getElementById("richCard2");
  const poorCard  = document.getElementById("poorCard2");
  const logEl     = document.getElementById("miniLog");
  const steps     = [...s2v2.querySelectorAll(".arb-step")];
  const result    = s2v2.querySelector(".result2");
  const flipEl    = document.getElementById("flipCount2");
  const profEl    = document.getElementById("profitCount2");

  let active = false;
  let flips = 0;
  let prof  = 0;
  let loopT = null;
  let logT  = null;

  const logItems = [
    {side:"buy",  text:"Kjøp Redline", price:"1 key"},
    {side:"sell", text:"Selg Redline", price:"2 keys"},
    {side:"buy",  text:"Lav float",    price:"1.1 keys"},
    {side:"sell", text:"Rask buyer",   price:"2.0 keys"}
  ];

  function pushLog(){
    if(!active) return;
    const it = logItems[Math.floor(Math.random()*logItems.length)];
    const row = document.createElement("div");
    row.className = `log-row ${it.side}`;
    row.innerHTML = `<span>${it.text}</span><span class="muted">${it.price}</span>`;
    logEl.prepend(row);
    if(logEl.children.length > 3) logEl.removeChild(logEl.lastChild);
    logT = setTimeout(pushLog, 700 + Math.random()*600);
  }

  function tradeLoop(){
    if(!active) return;

    // start ved billig side (rich)
    tradeSkin.style.transition = "none";
    tradeSkin.style.opacity = "0";
    tradeSkin.style.transform = "translate(-50%,-50%) translateX(-60px) scale(0.9)";
    richCard.classList.add("pulse-buy");

    requestAnimationFrame(()=>{
      tradeSkin.style.transition = "transform 1.25s ease, opacity .35s ease";
      tradeSkin.style.opacity = "1";
      tradeSkin.style.transform = "translate(-50%,-50%) translateX(60px) scale(1.0)";
    });

    // når den når dyr side (poor) -> profit
    setTimeout(()=>{
      richCard.classList.remove("pulse-buy");
      poorCard.classList.add("pulse-sell");

      flips++;
      prof += 1;
      flipEl.textContent = flips;
      profEl.textContent = prof;
    }, 1250);

    setTimeout(()=>{
      tradeSkin.style.opacity = "0";
      poorCard.classList.remove("pulse-sell");
      loopT = setTimeout(tradeLoop, 900 + Math.random()*900);
    }, 2000);
  }

  function startS2(){
    if(active) return;
    active = true;

    // reveal steg én og én
    steps.forEach((st, i)=>{
      setTimeout(()=> st.classList.add("is-on"), 350 + i*520);
    });
    setTimeout(()=> result?.classList.add("is-on"), 350 + steps.length*520);

    pushLog();
    tradeLoop();
  }

  function stopS2(){
    active = false;
    clearTimeout(loopT);
    clearTimeout(logT);
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) startS2();
      else stopS2();
    });
  }, {threshold: 0.6});

  obs.observe(s2v2);
}

/* pulse shadows brukt i S2 */
const pulseStyle = document.createElement("style");
pulseStyle.textContent = `
  .pulse-buy{
    box-shadow:0 0 0 1px rgba(110,255,191,.25),
              0 0 25px rgba(110,255,191,.35) !important;
  }
  .pulse-sell{
    box-shadow:0 0 0 1px rgba(255,168,107,.25),
              0 0 25px rgba(255,168,107,.35) !important;
  }
`;
document.head.appendChild(pulseStyle);

// Kapittel 4: liten delay på skin-showcase (valgfritt)
const s4 = document.querySelector("#s4");
if (s4){
  const showcase = s4.querySelector(".skin-showcase");
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && showcase){
        setTimeout(()=> showcase.classList.add("late-in"), 250);
        obs.disconnect();
      }
    });
  }, {threshold:0.6});
  obs.observe(s4);
}
/* ===== Kapittel 1: Origin interaksjon ===== */
const originWrap = document.querySelector('#s1 [data-anim="origin1"]');

if(originWrap){
  const tiles = [...originWrap.querySelectorAll(".origin-tile")];
  const note  = document.getElementById("originNote");

  function setNote(text){
    if(!note) return;
    note.textContent = text;
    note.classList.add("show");
  }

  tiles.forEach(t=>{
    const txt = t.dataset.note || "";
    t.addEventListener("mouseenter", ()=> setNote(txt));
    t.addEventListener("focus", ()=> setNote(txt));
    t.addEventListener("click", ()=> setNote(txt));
  });

  // liten sekvens når kapittel 1 kommer inn
  const oObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;

      tiles.forEach((t,i)=>{
        t.style.opacity = "0";
        t.style.transform = "translateY(6px)";
        setTimeout(()=>{
          t.style.transition = "opacity .45s ease, transform .45s ease";
          t.style.opacity = "1";
          t.style.transform = "translateY(0)";
        }, 150 + i*140);
      });

      oObs.disconnect();
    });
  }, {threshold:0.6});

  oObs.observe(originWrap);
}
// Sørger for at .chapter3 får reveal når #s3 er synlig (kun hvis du trenger)
const s3Inner = document.querySelector("#s3 .chapter3");
if(s3Inner){
  const obs3 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) s3Inner.classList.add("reveal");
    });
  }, {threshold:0.6});
  obs3.observe(s3Inner);
}
/* Kapittel 5: liten pulse-sekvens på dayline/portfolio (valgfritt) */
const s5Inner = document.querySelector('#s5 .chapter5');
if(s5Inner){
  const nodes = [...s5Inner.querySelectorAll('.daynode')];
  const cards = [...s5Inner.querySelectorAll('.ps-card')];

  const s5Obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;

      nodes.forEach((n,i)=>{
        setTimeout(()=> n.classList.add('pulse5'), 200+i*220);
        setTimeout(()=> n.classList.remove('pulse5'), 1200+i*220);
      });
      cards.forEach((c,i)=>{
        setTimeout(()=> c.classList.add('pulse5'), 700+i*260);
        setTimeout(()=> c.classList.remove('pulse5'), 1700+i*260);
      });

      s5Obs.disconnect();
    });
  }, {threshold:0.6});

  s5Obs.observe(s5Inner);
}

/* pulse style */
const pulse5Style = document.createElement("style");
pulse5Style.textContent = `
  .pulse5{
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 0 1px rgba(124,195,255,.45) inset,
                0 0 18px rgba(124,195,255,.55) !important;
  }
`;
document.head.appendChild(pulse5Style);
/* ===== Kapittel 6: Smooth og konstant mood needle + max X control ===== */
(function(){
  const section = document.querySelector("#s6");
  const needle = document.getElementById("moodNeedle");
  if (!section || !needle) return;

  let active = false;      
  let rafId = null;        
  let start = null;        

  /* === Justerbare verdier === */
  const MAX_X = 300;       // <— ENDRE DENNE FOR Å KONTROLLERE MAKS UTSLAG
  const NORMAL_RANGE = 200; // amplitude (standard var ~55)
  
  // Smooth oscillation function
  function animateNeedle(timestamp){
    if (!start) start = timestamp;
    const t = (timestamp - start) / 1000;

    // Pendelbevegelse — jevn og naturlig
    let x =
      Math.sin(t * 1.2) * NORMAL_RANGE +
      Math.sin(t * 0.45) * 20 +
      Math.sin(t * 0.12) * 8;

    // Begrensning: needle kan aldri gå utenfor MAX_X
    if (x > MAX_X) x = MAX_X;
    if (x < -MAX_X) x = -MAX_X;

    needle.style.transform = `translateX(${x}px)`;
    rafId = requestAnimationFrame(animateNeedle);
  }

  // Start/stop animasjon ved scroll
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !active){
        active = true;
        start = null;
        rafId = requestAnimationFrame(animateNeedle);
      }
      if(!entry.isIntersecting && active){
        active = false;
        cancelAnimationFrame(rafId);
      }
    });
  }, { threshold: 0.55 });

  obs.observe(section);
})();
/* ===== Kapittel 7: Loss log auto-fill ===== */
(function(){
  const section = document.querySelector("#s7");
  const log = document.getElementById("lossLog7");
  if(!section || !log) return;

  const losses = [
    "- 1. kniv scammed",
    "- 3 200 kr tapt på Wildfire flips",
    "- 9 500 kr tapt under Hydra crash",
    "- Pattern-investering som døde ut (≈ 14k kr)",
    "- Drift av marked pga panikksalg (7k kr)"
  ];

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        losses.forEach((text,i)=>{
          const el = document.createElement("div");
          el.className = "loss-entry";
          el.textContent = text;
          el.style.transitionDelay = `${i * 0.12}s`;
          log.appendChild(el);
        });
        obs.disconnect();
      }
    });
  }, {threshold:0.55});

  obs.observe(section);
})();
/* ===== Kapittel 8: Crash ticker + chart fill ===== */
/* ===== Kapittel 8: Tooltips etter grafen ble fjernet ===== */
(function(){
  const s8 = document.querySelector("#s8");
  const track = document.getElementById("crashTrack8");
  if(!s8 || !track) return;   // <-- riktig sjekk nå, siden grafen er borte

  const hot = [...s8.querySelectorAll(".hotword")];
  const tip = document.getElementById("tip8");
  if(!hot.length || !tip) return;


  const chips = [
    { t:"Rykter sprer seg", c:"" },
    { t:"Markedet rister", c:"" },
    { t:"Panikksalg", c:"down" },
    { t:"Items dumpes under verdi", c:"down" },
    { t:"Han kjøper rolig", c:"up" },
    { t:"Rebound-bølge", c:"up" },
    { t:"2–3k profit på timer", c:"up" },
    { t:"Kina dominerer volumet", c:"" },
    { t:"Massehype driver prisene", c:"" },
    { t:"Uregulert marked", c:"down" },
  ];

  function fillTicker(){
    track.innerHTML = "";
    // dupliser for seamless scroll
    const all = chips.concat(chips);
    all.forEach(ch=>{
      const el = document.createElement("div");
      el.className = "crash-chip " + (ch.c || "");
      el.textContent = ch.t;
      track.appendChild(el);
    });
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        fillTicker();
        // animer grafen til “fall → rebound → flat”
        requestAnimationFrame(()=> line.style.width = "100%");
        obs.disconnect();
      }
    });
  }, {threshold:0.6});

  obs.observe(s8);
})();
/* ===== Kapittel 8 (NY uten graf): terminal + stamps + ticker + shake ===== */
(function(){
  const s8 = document.querySelector("#s8");
  if(!s8) return;

  const steps = [...s8.querySelectorAll(".cstep")];
  const track = document.getElementById("crashTrack8");
  const termBody = document.getElementById("termBody8");
  const termStatus = document.getElementById("termStatus8");
  const termChip = document.getElementById("termChip8");
  const hot = [...s8.querySelectorAll(".hotword")];
  const tip = document.getElementById("tip8");

  const stampPanic = document.getElementById("stampPanic8");
  const stampSpread = document.getElementById("stampSpread8");
  const stampRebound = document.getElementById("stampRebound8");
  const stampExit = document.getElementById("stampExit8");

  if(!steps.length || !track || !termBody || !termStatus || !termChip) return;

  /* ticker */
  const chips = [
    {t:"Rykter sprer seg", c:""},
    {t:"Markedet rister", c:""},
    {t:"Panikksalg", c:"down"},
    {t:"Dump under verdi", c:"down"},
    {t:"Spread åpner seg", c:""},
    {t:"Han kjøper rolig", c:"up"},
    {t:"Rebound-bølge", c:"up"},
    {t:"2–3k profit", c:"up"},
    {t:"Ny usikker normal", c:""},
    {t:"Mindre tillit", c:"down"},
  ];
  function fillTicker(){
    track.innerHTML="";
    chips.concat(chips).forEach(ch=>{
      const el=document.createElement("div");
      el.className="crash-chip "+(ch.c||"");
      el.textContent=ch.t;
      track.appendChild(el);
    });
  }

  /* terminal lines som følger scroll-steps */
  const terminalLines = [
    {text:"> 00:43  Rykter i gang på Discord", cls:""},
    {text:"> 00:51  Volume spike / første dump", cls:"down"},
    {text:"> 01:04  Panikksalg eskalerer", cls:"down"},
    {text:"> 01:18  Spread åpner seg (billig side)", cls:""},
    {text:"> 01:33  KJØP: undervurderte items", cls:"up"},
    {text:"> 02:10  REBOUND → selg inn i hype", cls:"up"},
    {text:"> 03:00  Marked stabiliserer seg lavere", cls:""},
    {text:"> 03:12  Konklusjon: mindre tillit", cls:"down"},
  ];

  function renderTerminal(){
    termBody.innerHTML="";
    terminalLines.forEach((ln,i)=>{
      const div=document.createElement("div");
      div.className="term-line "+(ln.cls||"");
      div.dataset.i=i;
      div.textContent=ln.text;
      termBody.appendChild(div);
    });
  }
  renderTerminal();

  function setTerminalStep(k){
  const lines = [...termBody.querySelectorAll(".term-line")];

  const maxStep = Math.max(1, steps.length - 1);   // siste cstep-index
  const maxLine = lines.length - 1;               // siste terminal-linje

  // map cstep (0..maxStep) til terminal-line (0..maxLine)
  const lineK = Math.round((k / maxStep) * maxLine);

  lines.forEach((l,i)=> l.classList.toggle("on", i <= lineK));

  // status basert på lineK (ikke k)
  if(lineK <= 1){ termStatus.textContent="STABLE"; termStatus.style.borderColor="#233461"; }
  else if(lineK === 2){ termStatus.textContent="PANIC"; termStatus.style.borderColor="#6a2c2c"; }
  else if(lineK === 3){ termStatus.textContent="SPREAD"; termStatus.style.borderColor="#7cc3ff"; }
  else if(lineK === 4){ termStatus.textContent="BUYING"; termStatus.style.borderColor="#70ffbf"; }
  else if(lineK <= 6){ termStatus.textContent="REBOUND"; termStatus.style.borderColor="#70ffbf"; }
  else { termStatus.textContent="EXIT"; termStatus.style.borderColor="#ffa86b"; }

  const chips = [
    "listening…",
    "volatility ↑",
    "panic wave",
    "spread found",
    "buying",
    "selling",
    "new normal",
    "exit mode"
  ];
  termChip.textContent = chips[lineK] || "…";
}


  /* stamps + shake + panic list */
  const panicItems = [...s8.querySelectorAll(".panic-list li")];
  function setPanicStep(k){
    panicItems.forEach(li=>{
      const id = li.dataset.pop || "";
      const idx = id.startsWith("p") ? Number(id.slice(1)) : Number(id.slice(1)) + 3;
      li.classList.toggle("on", idx <= k);
    });
  }

  function showStamp(el, on){ el && el.classList.toggle("show", on); }

  function setVisualStep(k){
    steps.forEach((st,i)=> st.classList.toggle("active", i===k));
    setTerminalStep(k);
    setPanicStep(k);

    showStamp(stampPanic,  k>=1 && k<=2);
    showStamp(stampSpread, k===3);
    showStamp(stampRebound,k>=4 && k<=5);
    showStamp(stampExit,   k>=6);

    // subtle shake only in panic part
    s8.classList.toggle("shake", k===1 || k===2);
  }

  setVisualStep(0);

  const stepObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const k=Number(e.target.dataset.cstep||0);
      setVisualStep(k);
    });
  }, {threshold:0.65});
  steps.forEach(st=>stepObs.observe(st));

  const s8Obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        fillTicker();
        s8Obs.disconnect();
      }
    });
  }, {threshold:0.55});
  s8Obs.observe(s8);

  /* hotword tooltip */
    function showTip(text, x, y){
    tip.textContent = text;

    // gjør tip målelig uten å blinke
    tip.style.left = "0px";
    tip.style.top = "0px";
    tip.classList.add("show");

    const pos = getComputedStyle(tip).position;

    const w = tip.offsetWidth;
    const h = tip.offsetHeight;

    let left, top;

    if (pos === "fixed") {
      left = x - w/2;
      top  = y - h - 12;

      const pad = 8;
      left = Math.max(pad, Math.min(window.innerWidth - w - pad, left));
      if(top < pad) top = y + 12;
    } else {
      const rect = s8.getBoundingClientRect();
      left = (x - rect.left) - w/2;
      top  = (y - rect.top) - h - 12;

      const pad = 8;
      const maxLeft = s8.clientWidth - w - pad;
      left = Math.max(pad, Math.min(maxLeft, left));

      if(top < pad) top = (y - rect.top) + 12;
    }

    tip.style.left = left + "px";
    tip.style.top  = top  + "px";
  }

  function hideTip(){
    tip.classList.remove("show");
  }

  hot.forEach(w=>{
    const text = w.dataset.tip || "";
    w.addEventListener("mouseenter", ev => showTip(text, ev.clientX, ev.clientY));
    w.addEventListener("mousemove",  ev => showTip(text, ev.clientX, ev.clientY));
    w.addEventListener("mouseleave", hideTip);
  });

})();

